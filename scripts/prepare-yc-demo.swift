// Usage: swift -suppress-warnings scripts/prepare-yc-demo.swift OUTPUT_DIR DEPLOYMENT_MOV PERCEPTION_MOV
// Or: swift -suppress-warnings scripts/prepare-yc-demo.swift OUTPUT_DIR ONBOARD_MOV
// Export silent, streamable MP4s without embedded metadata; preserve source aspect ratios.
import Foundation
import AVFoundation
import ImageIO
import UniformTypeIdentifiers
let destination=URL(fileURLWithPath:CommandLine.arguments[1],isDirectory:true)
try FileManager.default.createDirectory(at:destination,withIntermediateDirectories:true)
let names = CommandLine.arguments.count == 3 ? ["onboard-tracking"] : ["deployment-concept", "perception-interface"]
for (index,name) in names.enumerated(){
 let source=AVURLAsset(url:URL(fileURLWithPath:CommandLine.arguments[index+2]))
 let duration=try await source.load(.duration)
 let track=try await source.loadTracks(withMediaType:.video).first!
 let composition=AVMutableComposition()
 let video=composition.addMutableTrack(withMediaType:.video,preferredTrackID:kCMPersistentTrackID_Invalid)!
 try video.insertTimeRange(CMTimeRange(start:.zero,duration:duration),of:track,at:.zero)
 video.preferredTransform=try await track.load(.preferredTransform)
 let output=destination.appendingPathComponent("\(name).mp4")
 let session=AVAssetExportSession(asset:composition,presetName:AVAssetExportPreset1280x720)!
 session.outputURL=output;session.outputFileType = .mp4;session.shouldOptimizeForNetworkUse=true;session.metadata=[]
 await session.export()
 guard session.status == .completed else {throw session.error ?? NSError(domain:"YCExport",code:1)}
 let asset=AVURLAsset(url:output);let gen=AVAssetImageGenerator(asset:asset);gen.appliesPreferredTrackTransform=true
 let image=try gen.copyCGImage(at:CMTime(seconds:3,preferredTimescale:600),actualTime:nil)
 let dest=CGImageDestinationCreateWithURL(destination.appendingPathComponent("\(name)-poster.jpg") as CFURL,UTType.jpeg.identifier as CFString,1,nil)!
 CGImageDestinationAddImage(dest,image,[kCGImageDestinationLossyCompressionQuality:0.88] as CFDictionary);CGImageDestinationFinalize(dest)
 print("\(name): \(CMTimeGetSeconds(duration)) seconds; audio tracks: \((try await asset.loadTracks(withMediaType:.audio)).count)")
}
