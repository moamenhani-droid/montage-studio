// Person matte using Apple Vision (VNGeneratePersonSegmentationRequest, accurate).
// Usage: matte <input.mp4> <width> <height>   → writes raw 8-bit gray frames to stdout,
// plus "cx=<body centre x>" per frame to stderr every 150 frames.
import AVFoundation
import CoreImage
import Foundation
import Vision

let args = CommandLine.arguments
let url = URL(fileURLWithPath: args[1])
let outW = Int(args[2])!, outH = Int(args[3])!

let asset = AVURLAsset(url: url)
let track = asset.tracks(withMediaType: .video)[0]
let reader = try! AVAssetReader(asset: asset)
let output = AVAssetReaderTrackOutput(
  track: track,
  outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
reader.add(output)
reader.startReading()

let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
request.outputPixelFormat = kCVPixelFormatType_OneComponent8

let ctx = CIContext(options: [.workingColorSpace: NSNull()])
var bitmap = [UInt8](repeating: 0, count: outW * outH)
let stdout = FileHandle.standardOutput
var n = 0
var centres: [Double] = []

while let sample = output.copyNextSampleBuffer(), let frame = CMSampleBufferGetImageBuffer(sample) {
  let handler = VNImageRequestHandler(cvPixelBuffer: frame, options: [:])
  try! handler.perform([request])
  guard let mask = request.results?.first?.pixelBuffer else { continue }
  var img = CIImage(cvPixelBuffer: mask)
  let sx = CGFloat(outW) / img.extent.width, sy = CGFloat(outH) / img.extent.height
  img = img.transformed(by: CGAffineTransform(scaleX: sx, y: sy))
  ctx.render(img, toBitmap: &bitmap, rowBytes: outW, bounds: CGRect(x: 0, y: 0, width: outW, height: outH),
             format: .L8, colorSpace: nil)
  stdout.write(Data(bitmap))
  // body centre on the torso band (45%–80% of height from the top)
  var sum = 0.0, wsum = 0.0
  for y in Int(Double(outH) * 0.45)..<Int(Double(outH) * 0.8) {
    let row = y * outW
    for x in stride(from: 0, to: outW, by: 2) {
      let v = Double(bitmap[row + x]); sum += v; wsum += v * Double(x)
    }
  }
  centres.append(sum > 0 ? wsum / sum : Double(outW) / 2)
  n += 1
  if n % 150 == 0 { FileHandle.standardError.write("\(n) frames\n".data(using: .utf8)!) }
}
let sorted = centres.sorted()
FileHandle.standardError.write("done \(n) median_cx=\(sorted[sorted.count / 2])\n".data(using: .utf8)!)
