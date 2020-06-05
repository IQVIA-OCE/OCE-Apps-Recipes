//
// Copyright (c) 2015-present, QIMS, inc. All rights reserved.
//

import UIKit
import Foundation
import OCEFramework

final class OCEAppDelegate: AppDelegate {

    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        _ = ReactProvider.default.addObserver { _ in
            guard let topViewController = UIApplication.shared.topViewController() else {
                assertionFailure("Cannot present Plugin screen. There is no top View Controller.")
                return
            }
            
            let urlString = ReactURLComponents.urlString()
            guard let url = URL(string: urlString) else {
                assertionFailure("Cannot initialize the url from string \(urlString).")
                return
            }
            
            // It is retained by ReactProvider.default inside ReactAppCoordinator.
             let reactAppCoordinator = ReactAppCoordinator(presenter: topViewController, bundleURL: url, appName: "React Native App", appVersion: "1.0")
                       reactAppCoordinator.start()
        }
        
        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }
}
