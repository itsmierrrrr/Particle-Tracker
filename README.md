# Particle Tracker

Particle Tracker is an interactive real-time particle visualization application that combines **3D graphics, computer vision, and gesture-based interaction**. The application uses hand tracking to allow users to interact with and control a dynamic particle system through natural hand movements.

## Overview

The project explores the integration of browser-based computer vision with real-time 3D rendering. Hand movements captured through the user's webcam are processed using MediaPipe and translated into interactions within a Three.js particle environment.

The result is a responsive and immersive interface where users can manipulate visual elements without relying solely on traditional mouse or keyboard input.

## Features

* Real-time hand tracking using MediaPipe
* Interactive 3D particle visualization
* Gesture-based particle interaction
* Webcam-based computer vision
* Dynamic particle movement and animation
* Real-time particle color customization
* Responsive web interface
* Hardware-accelerated rendering through WebGL

## Technology Stack

| Technology              | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| React                   | User interface and application architecture |
| Vite                    | Development server and build tooling        |
| Three.js                | 3D rendering and particle system            |
| MediaPipe               | Real-time hand tracking                     |
| MediaPipe Tasks Vision  | Hand landmark detection                     |
| WebGL                   | Hardware-accelerated graphics               |
| JavaScript / TypeScript | Application logic                           |
| CSS                     | Interface styling                           |

## Architecture

```text
Webcam
   |
   v
MediaPipe Hand Tracking
   |
   v
Hand Landmarks
   |
   v
Gesture Processing
   |
   v
Interaction Logic
   |
   v
Three.js Particle System
   |
   v
Real-Time Visualization
```

The webcam provides the input stream. MediaPipe detects the user's hand and generates landmark coordinates. These coordinates are processed by the application to determine interaction states, which are then used to update the Three.js particle system in real time.

## Interaction

The application supports gesture-driven interaction with the particle environment.

| Input          | Function                              |
| -------------- | ------------------------------------- |
| Hand movement  | Controls particle interaction         |
| Hand position  | Influences particle movement          |
| Gestures       | Triggers interactive particle effects |
| Color picker   | Changes particle appearance           |
| Mouse movement | Provides additional interaction       |

Gesture mappings can be extended as new interaction patterns are implemented.

## Project Structure

```text
particle-tracker/
│
├── public/
│   └── assets/
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* A modern browser with webcam support

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/particle-tracker.git
```

Navigate to the project directory:

```bash
cd particle-tracker
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local development URL provided by Vite.

## Camera Access

The application requires webcam access for hand tracking.

When prompted by the browser:

1. Allow camera access.
2. Position your hand within the camera frame.
3. Wait for the hand tracking model to initialize.
4. Interact with the particle system using hand movements.

For production deployments, camera access requires a secure HTTPS connection.

## Performance

The particle system uses WebGL through Three.js to provide hardware-accelerated rendering. Performance can vary depending on:

* GPU capabilities
* Number of rendered particles
* Browser performance
* Camera resolution
* Hand tracking inference workload

The application is designed to maintain responsive interaction while processing real-time vision data.

## Future Improvements

* Support for additional hand gestures
* Multiple particle formations
* Advanced particle physics
* Audio-reactive particle effects
* Gesture customization
* Improved mobile support
* WebXR and AR integration
* Performance optimization
* Custom particle textures and shapes
* More advanced computer vision interactions

## Use Cases

Particle Tracker can be used as a foundation for:

* Interactive portfolio experiences
* Creative coding projects
* Gesture-controlled interfaces
* Computer vision demonstrations
* 3D web applications
* Interactive installations
* Human-computer interaction experiments

## Contributing

Contributions and improvements are welcome.

To contribute:

```bash
git checkout -b feature/your-feature
```

Make your changes, test the application, and submit a pull request.

## License

This project is licensed under the MIT License.

## Author

**Mihir Sawant**

IT Engineering Student
Web Development | Computer Vision | Interactive 3D Experiences
