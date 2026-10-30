// Usage: swift -suppress-warnings scripts/prepare-investor-demo.swift OUTPUT_DIRECTORY SYSTEM_MOV MODELS_MOV
// Creates silent web MP4s and posters from the supplied concept animations.
// Replaces unvalidated performance figures with neutral concept captions.
// Originals remain unchanged. Requires macOS AVFoundation.
import Foundation
import AVFoundation
import QuartzCore
import CoreText
import ImageIO
import UniformTypeIdentifiers

let destination = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
try FileManager.default.createDirectory(at: destination, withIntermediateDirectories: true)
let width = 1280
let height = 726
let space = CGColorSpace(name: CGColorSpace.sRGB)!

func text(_ context: CGContext, _ value: String, _ x: CGFloat, _ y: CGFloat, _ size: CGFloat, _ gray: CGFloat = 0.94, mono: Bool = false) {
    let font = CTFontCreateWithName((mono ? "Menlo" : "Helvetica") as CFString, size, nil)
    let string = NSAttributedString(string: value, attributes: [NSAttributedString.Key(kCTFontAttributeName as String): font, NSAttributedString.Key(kCTForegroundColorAttributeName as String): CGColor(gray: gray, alpha: 1)])
    context.textPosition = CGPoint(x: x, y: y)
    CTLineDraw(CTLineCreateWithAttributedString(string), context)
}

func overlay(_ second: Bool, metrics: Bool = false) -> CGImage {
    let context = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: width * 4, space: space, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    if metrics {
        context.setFillColor(CGColor(gray: 0.028, alpha: 1))
        context.fill(CGRect(x: 82, y: 424, width: 238, height: 146))
        text(context, "DETECTION VIEW", 104, 534, 13, mono: true)
        text(context, "Illustrative scene", 104, 496, 16)
        text(context, "Concept visualization", 104, 463, 11, 0.65)
    } else {
        context.setFillColor(CGColor(gray: 0.028, alpha: 1))
        context.fill(CGRect(x: 0, y: 0, width: width, height: 111))
        context.setStrokeColor(CGColor(gray: 0.23, alpha: 1))
        context.setLineWidth(1)
        context.move(to: CGPoint(x: 0, y: 110.5)); context.addLine(to: CGPoint(x: CGFloat(width), y: 110.5)); context.strokePath()
        text(context, second ? "AIRCRAFT MODELS / CONCEPT STUDY" : "ACT-1 + ARCA-1 / SYSTEM CONCEPT", 36, 73, 16)
        text(context, second ? "Representative visual models" : "Illustrative sensor and aircraft workflow", 36, 35, 12, 0.65)
        text(context, "CONCEPT VISUALIZATION", 1000, 36, 10, 0.65, mono: true)
    }
    return context.makeImage()!
}

func export(_ filename: String, _ basename: String, _ second: Bool) async throws {
    let asset = AVURLAsset(url: URL(fileURLWithPath: filename))
    let duration = try await asset.load(.duration)
    let track = try await asset.loadTracks(withMediaType: .video).first!
    let naturalSize = try await track.load(.naturalSize)
    let transform = try await track.load(.preferredTransform)
    let composition = AVMutableComposition()
    let videoTrack = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
    try videoTrack.insertTimeRange(CMTimeRange(start: .zero, duration: duration), of: track, at: .zero)
    let instruction = AVMutableVideoCompositionInstruction()
    instruction.timeRange = CMTimeRange(start: .zero, duration: duration)
    let layerInstruction = AVMutableVideoCompositionLayerInstruction(assetTrack: videoTrack)
    layerInstruction.setTransform(transform.concatenating(CGAffineTransform(scaleX: CGFloat(width) / abs(naturalSize.applying(transform).width), y: CGFloat(height) / abs(naturalSize.applying(transform).height))), at: .zero)
    instruction.layerInstructions = [layerInstruction]
    let videoComposition = AVMutableVideoComposition()
    videoComposition.renderSize = CGSize(width: width, height: height)
    videoComposition.frameDuration = CMTime(value: 1, timescale: 24)
    videoComposition.instructions = [instruction]
    let parent = CALayer()
    parent.frame = CGRect(x: 0, y: 0, width: width, height: height)
    let videoLayer = CALayer()
    videoLayer.frame = parent.frame
    parent.addSublayer(videoLayer)
    let captionLayer = CALayer()
    captionLayer.frame = parent.frame
    captionLayer.contents = overlay(second)
    parent.addSublayer(captionLayer)
    if !second {
        let metricsLayer = CALayer()
        metricsLayer.frame = parent.frame
        metricsLayer.contents = overlay(false, metrics: true)
        metricsLayer.opacity = 0
        let animation = CAKeyframeAnimation(keyPath: "opacity")
        let seconds = CMTimeGetSeconds(duration)
        animation.values = [0, 1, 0, 0]
        animation.keyTimes = [0, NSNumber(value: 8.0 / seconds), NSNumber(value: 16.5 / seconds), 1]
        animation.calculationMode = .discrete
        animation.beginTime = AVCoreAnimationBeginTimeAtZero
        animation.duration = seconds
        animation.isRemovedOnCompletion = false
        metricsLayer.add(animation, forKey: "hide-unvalidated-metrics")
        parent.addSublayer(metricsLayer)
    }
    videoComposition.animationTool = AVVideoCompositionCoreAnimationTool(postProcessingAsVideoLayer: videoLayer, in: parent)
    let output = destination.appendingPathComponent("\(basename).mp4")
    if FileManager.default.fileExists(atPath: output.path) { try FileManager.default.removeItem(at: output) }
    let session = AVAssetExportSession(asset: composition, presetName: AVAssetExportPreset1280x720)!
    session.outputURL = output
    session.outputFileType = .mp4
    session.shouldOptimizeForNetworkUse = true
    session.metadata = []
    session.videoComposition = videoComposition
    await session.export()
    if session.status != .completed { throw session.error ?? NSError(domain: "DemoExport", code: 1) }
    let exported = AVURLAsset(url: output)
    let generator = AVAssetImageGenerator(asset: exported)
    generator.appliesPreferredTrackTransform = true
    let poster = try generator.copyCGImage(at: CMTime(seconds: second ? 2.5 : 5.0, preferredTimescale: 600), actualTime: nil)
    let image = CGImageDestinationCreateWithURL(destination.appendingPathComponent("\(basename)-poster.jpg") as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(image, poster, [kCGImageDestinationLossyCompressionQuality: 0.88] as CFDictionary)
    CGImageDestinationFinalize(image)
    print("Exported \(basename): \(CMTimeGetSeconds(duration))s, \((try await exported.loadTracks(withMediaType: .audio)).count) audio tracks")
}

try await export(CommandLine.arguments[2], "system-concept", false)
try await export(CommandLine.arguments[3], "aircraft-models", true)
