import AVKit
import AVFoundation
import UIKit

@objc(PIPManager)
class PIPManager: NSObject {
    static let shared = PIPManager()
    
    private var pipController: AVPictureInPictureController?
    private var playerLayer: AVPlayerLayer?
    private var isConfigured = false
    
    @objc
    func checkPiPSupport(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let isPiPSupported = AVPictureInPictureController.isPictureInPictureSupported()
        let deviceInfo = getDeviceInfo()
        
        resolve([
            "isSupported": isPiPSupported,
            "deviceInfo": deviceInfo
        ])
    }
    
    @objc
    func configurePiP(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("PIPManager: configurePiP called")
        
        guard AVPictureInPictureController.isPictureInPictureSupported() else {
            let deviceInfo = getDeviceInfo()
            print("PIPManager: PiP is not supported on this device. Device info: \(deviceInfo)")
            reject("PIP_NOT_SUPPORTED", "PiP is not supported on this device", nil)
            return
        }
        
        // ... rest of the configurePiP method remains the same ...
    }
    
    private func getDeviceInfo() -> [String: String] {
        let device = UIDevice.current
        return [
            "model": device.model,
            "systemName": device.systemName,
            "systemVersion": device.systemVersion,
            "isSimulator": isSimulator().description
        ]
    }
    
    private func isSimulator() -> Bool {
        #if targetEnvironment(simulator)
        return true
        #else
        return false
        #endif
    }
    
    // ... rest of the class remains the same ...
}
