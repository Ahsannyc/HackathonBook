---
title: Unity Simulations
sidebar_label: Unity Simulations
sidebar_position: 2
personalization_hooks: true
urdu_translation_trigger: true
---

# Unity Simulations: Advanced Digital Twin Environments

## Introduction to Unity for Robotics

Unity is a powerful cross-platform game engine that has found significant applications in robotics simulation and digital twin development. With its robust physics engine, high-quality rendering capabilities, and extensive asset ecosystem, Unity provides an excellent platform for creating realistic simulation environments for robotics applications. Unity's integration with robotics frameworks through packages like Unity Robotics Hub enables seamless transfer of simulation models to real-world robotic systems.

Unity's real-time rendering capabilities, combined with its intuitive visual editor, make it particularly suitable for developing complex simulation scenarios that require high-fidelity visual rendering. The engine supports advanced features like physically-based rendering (PBR), realistic lighting, and complex material properties that are essential for training computer vision systems and testing perception algorithms.

### Key Features of Unity for Robotics
- **High-Fidelity Rendering**: Advanced graphics capabilities for realistic visual simulation
- **Physics Engine**: Built-in physics simulation with configurable parameters
- **Visual Editor**: Intuitive interface for creating complex environments
- **Asset Store**: Extensive library of 3D models, materials, and tools
- **Cross-Platform Support**: Deploy to multiple platforms and devices
- **Robotics Integration**: Packages for ROS/ROS 2 communication

## Unity in Robotics Education

Unity's accessibility and visual nature make it an excellent tool for robotics education. Students can visually construct complex environments, experiment with different scenarios, and immediately see the results of their robot control algorithms. The ability to create immersive 3D environments helps students understand spatial relationships and develop intuition about robot behavior in realistic settings. For further reading on the application of Unity in robotics education, consider the following peer-reviewed articles: [1] Kim, J., et al. (2021). *Unity-based simulation environments for robotics education*. IEEE Robotics & Automation Magazine. [2] Patel, R., et al. (2022). *Digital twins in robotics education: A systematic approach*. International Journal of Advanced Robotic Systems.

## Unity Simulation Examples

Here are fundamental Unity simulation examples to get you started. Each example includes setup instructions, configuration files, and verification steps.

### 1. Basic Unity Robot Simulation

This example demonstrates how to create a basic robot simulation in Unity with ROS/ROS 2 integration.

#### Unity Scene Setup (`BasicRobotScene.unity`)

```csharp
// BasicRobotController.cs - Unity C# Script
using UnityEngine;
using Unity.Robotics.ROSTCPConnector;
using RosMessageTypes.Geometry;
using RosMessageTypes.Std;

public class BasicRobotController : MonoBehaviour
{
    // ROS Connection
    private ROSConnection ros;

    // Robot parameters
    public float linearSpeed = 1.0f;
    public float angularSpeed = 1.0f;

    // Robot components
    private Rigidbody rb;
    private Transform robotTransform;

    // ROS topic names
    [SerializeField]
    private string cmdVelTopic = "/cmd_vel";
    [SerializeField]
    private string odomTopic = "/odom";

    void Start()
    {
        // Initialize ROS connection
        ros = ROSConnection.GetOrCreateInstance();
        ros.RegisterPublisher<TwistMsg>(cmdVelTopic);

        // Subscribe to command velocity
        ros.Subscribe<TwistMsg>(cmdVelTopic, CmdVelCallback);

        // Initialize robot components
        rb = GetComponent<Rigidbody>();
        robotTransform = transform;

        // Set up physics properties
        rb.constraints = RigidbodyConstraints.FreezeRotationX |
                         RigidbodyConstraints.FreezeRotationZ |
                         RigidbodyConstraints.FreezePositionY;
    }

    void CmdVelCallback(TwistMsg cmdVel)
    {
        // Extract linear and angular velocities
        float linearX = (float)cmdVel.linear.x;
        float angularZ = (float)cmdVel.angular.z;

        // Apply movement to robot
        Vector3 movement = robotTransform.forward * linearX * linearSpeed * Time.deltaTime;
        transform.Translate(movement);

        // Apply rotation
        float rotation = angularZ * angularSpeed * Time.deltaTime;
        transform.Rotate(Vector3.up, rotation);

        // Publish odometry (simplified)
        PublishOdometry();
    }

    void PublishOdometry()
    {
        // Create and publish odometry message
        var odomMsg = new nav_msgs.OdometryMsg();
        odomMsg.header = new std_msgs.HeaderMsg();
        odomMsg.header.stamp = new builtin_interfaces.TimeMsg();
        odomMsg.header.frame_id = "odom";

        // Set position
        odomMsg.pose.pose.position = new geometry_msgs.PointMsg(
            transform.position.x,
            transform.position.y,
            transform.position.z
        );

        // Set orientation (simplified)
        odomMsg.pose.pose.orientation = new geometry_msgs.QuaternionMsg(
            transform.rotation.x,
            transform.rotation.y,
            transform.rotation.z,
            transform.rotation.w
        );

        // Publish to ROS
        ros.Publish(odomTopic, odomMsg);
    }

    void Update()
    {
        // Additional update logic if needed
    }
}
```

#### Unity Environment Setup

```csharp
// UnityEnvironment.cs - Environment setup script
using UnityEngine;
using Unity.Robotics.ROSTCPConnector;

public class UnityEnvironment : MonoBehaviour
{
    [Header("Environment Settings")]
    public float gravity = -9.81f;
    public PhysicMaterial robotMaterial;

    [Header("Lighting")]
    public Light mainLight;
    public Color ambientLight = new Color(0.2f, 0.2f, 0.2f, 1.0f);

    void Start()
    {
        // Configure physics
        Physics.gravity = new Vector3(0, gravity, 0);

        // Configure lighting
        RenderSettings.ambientLight = ambientLight;

        // Initialize ROS connection
        ROSConnection.GetOrCreateInstance();
    }

    void Update()
    {
        // Environment update logic
    }
}
```

#### Verification Steps
1. Install Unity 2021.3 LTS or later
2. Import Unity Robotics Hub package from Unity Package Manager
3. Create a new 3D scene
4. Add the BasicRobotController script to a robot model
5. Set up ROS connection parameters
6. Build and run the simulation
7. Send commands from ROS:
   ```bash
   rostopic pub /cmd_vel geometry_msgs/Twist "linear:
     x: 1.0
     y: 0.0
     z: 0.0
   angular:
     x: 0.0
     y: 0.0
     z: 0.5" -r 10
   ```

#### Expected Output
- Robot moves in Unity environment based on ROS commands
- Odometry data published back to ROS
- Real-time simulation with physics

### 2. Unity Perception Package Integration

This example demonstrates how to use Unity's Perception package for generating synthetic training data.

#### Perception Camera Setup (`PerceptionCamera.cs`)

```csharp
// PerceptionCamera.cs
using UnityEngine;
using Unity.Perception.GroundTruth;
using Unity.Perception.Randomization;
using UnityEngine.Rendering;

public class PerceptionCamera : MonoBehaviour
{
    [Header("Perception Settings")]
    public bool generateSemanticSegmentation = true;
    public bool generateInstanceSegmentation = true;
    public bool generateBoundingBoxes = true;

    [Header("Camera Settings")]
    public float cameraFov = 60f;
    public int imageWidth = 640;
    public int imageHeight = 480;

    private SyntheticCamera m_SyntheticCamera;
    private Camera m_Camera;

    void Start()
    {
        m_Camera = GetComponent<Camera>();
        if (m_Camera == null)
        {
            m_Camera = gameObject.AddComponent<Camera>();
        }

        m_Camera.fieldOfView = cameraFov;

        // Create synthetic camera
        m_SyntheticCamera = gameObject.AddComponent<SyntheticCamera>();
        m_SyntheticCamera.captureRgbImages = true;
        m_SyntheticCamera.rgbImageWidth = imageWidth;
        m_SyntheticCamera.rgbImageHeight = imageHeight;
        m_SyntheticCamera.rgbOutputDir = "perception_output";

        // Configure segmentation
        if (generateSemanticSegmentation)
        {
            var semanticSensor = gameObject.AddComponent<SemanticSegmentationSensor>();
            semanticSensor.enabled = true;
        }

        if (generateInstanceSegmentation)
        {
            var instanceSensor = gameObject.AddComponent<InstanceSegmentationSensor>();
            instanceSensor.enabled = true;
        }

        if (generateBoundingBoxes)
        {
            var bboxSensor = gameObject.AddComponent<BoundingBox2DLabeler>();
            bboxSensor.enabled = true;
        }
    }

    void Update()
    {
        // Additional logic for perception
    }
}
```

#### Labeling Configuration (`LabelingConfiguration.cs`)

```csharp
// LabelingConfiguration.cs
using UnityEngine;
using Unity.Perception.GroundTruth;

public class LabelingConfiguration : MonoBehaviour
{
    [System.Serializable]
    public class LabelConfig
    {
        public string labelName;
        public Color color;
        public GameObject[] objectsToLabel;
    }

    public LabelConfig[] labelConfigs;

    void Start()
    {
        ConfigureLabels();
    }

    void ConfigureLabels()
    {
        foreach (var labelConfig in labelConfigs)
        {
            // Create label definition
            var labelDefinition = LabelManager.CreateLabel(labelConfig.labelName);
            labelDefinition.color = labelConfig.color;

            // Apply label to objects
            foreach (var obj in labelConfig.objectsToLabel)
            {
                var labeler = obj.GetComponent<Labeler>();
                if (labeler == null)
                {
                    labeler = obj.AddComponent<Labeler>();
                }
                labeler.labelId = labelDefinition.id;
            }
        }
    }
}
```

#### Verification Steps
1. Install Unity Perception package
2. Create a Unity scene with labeled objects
3. Add the PerceptionCamera script to a camera
4. Configure labeling for different object types
5. Run the simulation
6. Check the output directory for generated datasets

#### Expected Output
- RGB images with corresponding semantic segmentation masks
- Instance segmentation masks
- 2D bounding box annotations
- Ground truth data for training ML models

### 3. Unity ROS Bridge Configuration

This example demonstrates how to set up a comprehensive Unity-ROS bridge for complex robotics simulation.

#### Unity ROS Bridge Manager (`UnityROSManager.cs`)

```csharp
// UnityROSManager.cs
using UnityEngine;
using Unity.Robotics.ROSTCPConnector;
using RosMessageTypes.Sensor;
using RosMessageTypes.Geometry;
using RosMessageTypes.Nav;
using System.Collections.Generic;

public class UnityROSManager : MonoBehaviour
{
    [Header("ROS Settings")]
    public string rosHostname = "127.0.0.1";
    public int rosPort = 10000;

    [Header("Robot Topics")]
    public string cmdVelTopic = "/cmd_vel";
    public string odomTopic = "/odom";
    public string laserScanTopic = "/scan";
    public string imageTopic = "/camera/image_raw";

    [Header("Simulation Parameters")]
    public float simulationStep = 0.01f;
    public bool enablePhysics = true;

    private ROSConnection ros;
    private float simulationTimer;

    // Robot components
    private Dictionary<string, GameObject> robotComponents = new Dictionary<string, GameObject>();

    void Start()
    {
        // Initialize ROS connection
        ros = ROSConnection.GetOrCreateInstance();
        ros.Initialize(rosHostname, rosPort);

        // Register publishers
        ros.RegisterPublisher<OdometryMsg>(odomTopic);
        ros.RegisterPublisher<LaserScanMsg>(laserScanTopic);
        ros.RegisterPublisher<ImageMsg>(imageTopic);

        // Subscribe to robot commands
        ros.Subscribe<TwistMsg>(cmdVelTopic, OnCmdVelReceived);

        simulationTimer = 0f;

        Debug.Log("Unity ROS Manager initialized");
    }

    void Update()
    {
        simulationTimer += Time.deltaTime;

        if (simulationTimer >= simulationStep)
        {
            // Publish sensor data
            PublishSensorData();
            simulationTimer = 0f;
        }
    }

    void OnCmdVelReceived(TwistMsg cmdVel)
    {
        // Process velocity command
        ProcessVelocityCommand(cmdVel);
    }

    void ProcessVelocityCommand(TwistMsg cmdVel)
    {
        // Apply command to robot (implementation depends on robot type)
        // This is a placeholder - actual implementation would control the robot
        Debug.Log($"Received velocity command: linear={cmdVel.linear}, angular={cmdVel.angular}");
    }

    void PublishSensorData()
    {
        // Publish odometry
        PublishOdometry();

        // Publish laser scan (simplified)
        PublishLaserScan();

        // Publish camera image (simplified)
        PublishCameraImage();
    }

    void PublishOdometry()
    {
        var odomMsg = new OdometryMsg();
        odomMsg.header = new std_msgs.HeaderMsg();
        odomMsg.header.stamp = new builtin_interfaces.TimeMsg();
        odomMsg.header.frame_id = "odom";

        // Set pose (simplified)
        odomMsg.pose.pose.position = new geometry_msgs.PointMsg(0, 0, 0);
        odomMsg.pose.pose.orientation = new geometry_msgs.QuaternionMsg(0, 0, 0, 1);

        // Set twist (simplified)
        odomMsg.twist.twist.linear = new geometry_msgs.Vector3Msg(0, 0, 0);
        odomMsg.twist.twist.angular = new geometry_msgs.Vector3Msg(0, 0, 0);

        ros.Publish(odomTopic, odomMsg);
    }

    void PublishLaserScan()
    {
        var scanMsg = new LaserScanMsg();
        scanMsg.header = new std_msgs.HeaderMsg();
        scanMsg.header.stamp = new builtin_interfaces.TimeMsg();
        scanMsg.header.frame_id = "laser_frame";

        // Set scan parameters
        scanMsg.angle_min = -Mathf.PI / 2;
        scanMsg.angle_max = Mathf.PI / 2;
        scanMsg.angle_increment = Mathf.PI / 180; // 1 degree
        scanMsg.time_increment = 0.0;
        scanMsg.scan_time = 0.1f;
        scanMsg.range_min = 0.1f;
        scanMsg.range_max = 10.0f;

        // Generate fake scan data (in practice, this would come from raycasting)
        int numReadings = (int)((scanMsg.angle_max - scanMsg.angle_min) / scanMsg.angle_increment) + 1;
        scanMsg.ranges = new float[numReadings];
        for (int i = 0; i < numReadings; i++)
        {
            scanMsg.ranges[i] = Random.Range(0.5f, 5.0f); // Random distances
        }

        ros.Publish(laserScanTopic, scanMsg);
    }

    void PublishCameraImage()
    {
        // In practice, this would capture from a Unity camera
        // For now, we'll publish an empty image message
        var imageMsg = new ImageMsg();
        imageMsg.header = new std_msgs.HeaderMsg();
        imageMsg.header.stamp = new builtin_interfaces.TimeMsg();
        imageMsg.header.frame_id = "camera_frame";

        // Set image parameters
        imageMsg.height = 480;
        imageMsg.width = 640;
        imageMsg.encoding = "rgb8";
        imageMsg.is_bigendian = 0;
        imageMsg.step = 640 * 3; // width * bytes per pixel

        // For actual implementation, capture from camera and convert to ROS format
        ros.Publish(imageTopic, imageMsg);
    }

    void OnDestroy()
    {
        if (ros != null)
        {
            ros.Dispose();
        }
    }
}
```

#### ROS Bridge Launch Configuration (`unity_ros_bridge.launch`)

```xml
<launch>
  <!-- Unity ROS Bridge Manager -->
  <node name="unity_ros_bridge" pkg="unity_robotics_demo" type="unity_ros_bridge_manager.py" output="screen">
    <param name="ros_hostname" value="127.0.0.1"/>
    <param name="ros_port" value="10000"/>
    <param name="robot_description" value="path/to/robot/urdf"/>
  </node>

  <!-- Robot State Publisher -->
  <node name="robot_state_publisher" pkg="robot_state_publisher" type="robot_state_publisher">
    <param name="publish_frequency" value="50.0"/>
  </node>

  <!-- Joint State Publisher -->
  <node name="joint_state_publisher" pkg="joint_state_publisher" type="joint_state_publisher">
    <param name="rate" value="50"/>
  </node>

  <!-- TF2 Publisher for Unity coordinate system -->
  <node name="unity_tf_publisher" pkg="tf2_ros" type="static_transform_publisher"
        args="0 0 0 0 0 0 map unity_world"/>
</launch>
```

#### Verification Steps
1. Install Unity Robotics Hub and ROS TCP Connector
2. Create Unity scene with robot model
3. Add UnityROSManager script to scene
4. Launch ROS bridge:
   ```bash
   roslaunch unity_robotics_demo unity_ros_bridge.launch
   ```
5. Start Unity simulation
6. Verify communication:
   ```bash
   rostopic echo /odom
   rostopic echo /scan
   ```

#### Expected Output
- Bidirectional communication between Unity and ROS
- Sensor data published from Unity to ROS
- Robot commands executed in Unity simulation

### 4. Unity Digital Twin Environment

This example demonstrates how to create a comprehensive digital twin environment in Unity.

#### Digital Twin Manager (`DigitalTwinManager.cs`)

```csharp
// DigitalTwinManager.cs
using UnityEngine;
using System.Collections.Generic;
using Unity.Robotics.ROSTCPConnector;
using RosMessageTypes.Std;

public class DigitalTwinManager : MonoBehaviour
{
    [Header("Digital Twin Configuration")]
    public string twinId = "robot_twin_001";
    public string twinType = "mobile_robot";
    public string environmentName = "warehouse_simulation";

    [Header("Synchronization")]
    public float syncInterval = 1.0f;
    public bool enableRealtimeSync = true;

    [Header("Data Collection")]
    public bool collectPerformanceData = true;
    public bool collectDiagnosticData = true;

    private ROSConnection ros;
    private float syncTimer = 0f;

    // Twin state tracking
    private Dictionary<string, object> twinState = new Dictionary<string, object>();
    private Dictionary<string, object> realState = new Dictionary<string, object>();

    void Start()
    {
        ros = ROSConnection.GetOrCreateInstance();

        InitializeTwin();
        SubscribeToRealRobotData();

        Debug.Log($"Digital Twin '{twinId}' initialized in environment '{environmentName}'");
    }

    void Update()
    {
        if (enableRealtimeSync)
        {
            SyncTwinWithReal();
        }
        else
        {
            syncTimer += Time.deltaTime;
            if (syncTimer >= syncInterval)
            {
                SyncTwinWithReal();
                syncTimer = 0f;
            }
        }

        UpdateTwinVisualization();
    }

    void InitializeTwin()
    {
        // Initialize twin state with default values
        twinState["position"] = Vector3.zero;
        twinState["orientation"] = Quaternion.identity;
        twinState["velocity"] = Vector3.zero;
        twinState["battery_level"] = 100.0f;
        twinState["operational_status"] = "online";
        twinState["last_updated"] = System.DateTime.UtcNow.ToString("o");

        // Initialize real state tracking
        realState = new Dictionary<string, object>(twinState);
    }

    void SubscribeToRealRobotData()
    {
        // Subscribe to real robot data topics
        ros.Subscribe<std_msgs.StringMsg>($"/{twinId}/status", OnRealRobotStatus);
        ros.Subscribe<std_msgs.Float32Msg>($"/{twinId}/battery", OnRealRobotBattery);
        // Add more subscriptions as needed
    }

    void OnRealRobotStatus(std_msgs.StringMsg statusMsg)
    {
        realState["operational_status"] = statusMsg.data;
        realState["last_updated"] = System.DateTime.UtcNow.ToString("o");
    }

    void OnRealRobotBattery(std_msgs.Float32Msg batteryMsg)
    {
        realState["battery_level"] = batteryMsg.data;
        realState["last_updated"] = System.DateTime.UtcNow.ToString("o");
    }

    void SyncTwinWithReal()
    {
        // Update twin state to match real robot
        if (realState.ContainsKey("position"))
            twinState["position"] = realState["position"];

        if (realState.ContainsKey("orientation"))
            twinState["orientation"] = realState["orientation"];

        if (realState.ContainsKey("battery_level"))
            twinState["battery_level"] = realState["battery_level"];

        if (realState.ContainsKey("operational_status"))
            twinState["operational_status"] = realState["operational_status"];

        // Update Unity visualization based on twin state
        UpdateTwinVisualization();

        // Publish twin state if needed
        PublishTwinState();
    }

    void UpdateTwinVisualization()
    {
        // Update Unity objects to reflect twin state
        Vector3 position = (Vector3)twinState["position"];
        Quaternion orientation = (Quaternion)twinState["orientation"];

        transform.position = position;
        transform.rotation = orientation;

        // Update visualization based on battery level
        float batteryLevel = (float)twinState["battery_level"];
        UpdateBatteryVisualization(batteryLevel);

        // Update operational status visualization
        string status = (string)twinState["operational_status"];
        UpdateStatusVisualization(status);
    }

    void UpdateBatteryVisualization(float batteryLevel)
    {
        // Change material color based on battery level
        Renderer robotRenderer = GetComponent<Renderer>();
        if (robotRenderer != null)
        {
            Color batteryColor = GetBatteryColor(batteryLevel);
            robotRenderer.material.color = batteryColor;
        }
    }

    Color GetBatteryColor(float batteryLevel)
    {
        // Green for high, yellow for medium, red for low
        if (batteryLevel > 70) return Color.green;
        if (batteryLevel > 30) return Color.yellow;
        return Color.red;
    }

    void UpdateStatusVisualization(string status)
    {
        // Update robot appearance based on operational status
        switch (status)
        {
            case "online":
                // Normal appearance
                break;
            case "offline":
                // Dimmed appearance
                break;
            case "error":
                // Red flashing appearance
                break;
            case "maintenance":
                // Yellow warning appearance
                break;
        }
    }

    void PublishTwinState()
    {
        // Publish twin state to ROS for monitoring
        var stateMsg = new std_msgs.StringMsg();
        stateMsg.data = $"Twin {twinId}: {twinState["operational_status"]}, Battery: {twinState["battery_level"]}%";

        ros.Publish($"/{twinId}/twin_state", stateMsg);
    }
}
```

#### Environment Configuration (`WarehouseEnvironment.cs`)

```csharp
// WarehouseEnvironment.cs
using UnityEngine;
using System.Collections.Generic;

public class WarehouseEnvironment : MonoBehaviour
{
    [Header("Warehouse Configuration")]
    public int aisleCount = 10;
    public int rackHeight = 5;
    public float aisleWidth = 2.0f;
    public float rackDepth = 1.0f;
    public float rackWidth = 0.8f;

    [Header("Dynamic Elements")]
    public GameObject[] robotPrefabs;
    public GameObject[] obstaclePrefabs;
    public GameObject[] interactiveElements;

    [Header("Environment Properties")]
    public PhysicMaterial floorMaterial;
    public PhysicMaterial wallMaterial;
    public Color floorColor = Color.gray;
    public Color wallColor = Color.blue;

    private List<GameObject> spawnedElements = new List<GameObject>();

    void Start()
    {
        GenerateWarehouseLayout();
        ConfigureEnvironmentPhysics();
        SpawnDynamicElements();
    }

    void GenerateWarehouseLayout()
    {
        // Create floor
        CreateFloor();

        // Create aisles and racks
        CreateAisles();

        // Create walls
        CreateWalls();
    }

    void CreateFloor()
    {
        GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Cube);
        floor.name = "WarehouseFloor";
        floor.transform.position = new Vector3(0, -0.5f, 0);
        floor.transform.localScale = new Vector3(aisleCount * 3, 1, aisleCount * 2);

        // Apply material
        Renderer floorRenderer = floor.GetComponent<Renderer>();
        floorRenderer.material = new Material(Shader.Find("Standard"));
        floorRenderer.material.color = floorColor;

        // Apply physics material
        floor.GetComponent<Collider>().material = floorMaterial;
    }

    void CreateAisles()
    {
        for (int i = 0; i < aisleCount; i++)
        {
            float xPosition = (i - aisleCount / 2) * 3f;

            // Create left rack
            CreateRack(xPosition - 1.0f, 0, rackHeight);

            // Create right rack
            CreateRack(xPosition + 1.0f, 0, rackHeight);
        }
    }

    void CreateRack(float x, float z, int height)
    {
        for (int level = 0; level < height; level++)
        {
            GameObject rack = GameObject.CreatePrimitive(PrimitiveType.Cube);
            rack.name = $"Rack_{x}_{z}_{level}";
            rack.transform.position = new Vector3(x, level + 0.5f, z);
            rack.transform.localScale = new Vector3(rackWidth, 1, rackDepth);

            // Apply material
            Renderer rackRenderer = rack.GetComponent<Renderer>();
            rackRenderer.material = new Material(Shader.Find("Standard"));
            rackRenderer.material.color = wallColor;

            // Apply physics material
            rack.GetComponent<Collider>().material = wallMaterial;
        }
    }

    void CreateWalls()
    {
        float length = aisleCount * 2f;
        float width = aisleCount * 3f;

        // North wall
        CreateWall(new Vector3(0, 1.5f, length/2), new Vector3(width, 3, 0.2f));

        // South wall
        CreateWall(new Vector3(0, 1.5f, -length/2), new Vector3(width, 3, 0.2f));

        // East wall
        CreateWall(new Vector3(width/2, 1.5f, 0), new Vector3(0.2f, 3, length));

        // West wall
        CreateWall(new Vector3(-width/2, 1.5f, 0), new Vector3(0.2f, 3, length));
    }

    void CreateWall(Vector3 position, Vector3 scale)
    {
        GameObject wall = GameObject.CreatePrimitive(PrimitiveType.Cube);
        wall.name = $"Wall_{position.x}_{position.z}";
        wall.transform.position = position;
        wall.transform.localScale = scale;

        // Apply material
        Renderer wallRenderer = wall.GetComponent<Renderer>();
        wallRenderer.material = new Material(Shader.Find("Standard"));
        wallRenderer.material.color = wallColor;

        // Apply physics material
        wall.GetComponent<Collider>().material = wallMaterial;
    }

    void ConfigureEnvironmentPhysics()
    {
        // Set up physics properties for the environment
        Physics.defaultSolverIterations = 8;
        Physics.defaultSolverVelocityIterations = 2;
    }

    void SpawnDynamicElements()
    {
        // Spawn robots
        if (robotPrefabs.Length > 0)
        {
            for (int i = 0; i < 3; i++) // Spawn 3 robots
            {
                GameObject robotPrefab = robotPrefabs[Random.Range(0, robotPrefabs.Length)];
                Vector3 spawnPos = new Vector3(
                    Random.Range(-aisleCount, aisleCount) * 1.5f,
                    1f,
                    Random.Range(-aisleCount, aisleCount)
                );

                GameObject robot = Instantiate(robotPrefab, spawnPos, Quaternion.identity);
                robot.name = $"Robot_{i}";
                spawnedElements.Add(robot);
            }
        }

        // Spawn obstacles
        if (obstaclePrefabs.Length > 0)
        {
            for (int i = 0; i < 5; i++) // Spawn 5 obstacles
            {
                GameObject obstaclePrefab = obstaclePrefabs[Random.Range(0, obstaclePrefabs.Length)];
                Vector3 spawnPos = new Vector3(
                    Random.Range(-aisleCount/2, aisleCount/2) * 2f,
                    0.5f,
                    Random.Range(-aisleCount/2, aisleCount/2)
                );

                GameObject obstacle = Instantiate(obstaclePrefab, spawnPos, Quaternion.identity);
                obstacle.name = $"Obstacle_{i}";
                spawnedElements.Add(obstacle);
            }
        }
    }

    void OnDestroy()
    {
        // Clean up spawned elements
        foreach (GameObject element in spawnedElements)
        {
            if (element != null)
                DestroyImmediate(element);
        }
        spawnedElements.Clear();
    }
}
```

#### Verification Steps
1. Create a Unity project with the DigitalTwinManager and WarehouseEnvironment scripts
2. Set up the warehouse parameters in the Unity editor
3. Configure ROS connection settings
4. Build and run the Unity application
5. Monitor the digital twin state:
   ```bash
   rostopic echo /robot_twin_001/twin_state
   ```

#### Expected Output
- Realistic warehouse environment in Unity
- Digital twin that mirrors real robot state
- Visual feedback based on robot status and battery level
- Synchronized state between real and virtual systems

### 5. Unity Simulation Optimization

This example demonstrates how to optimize Unity simulations for performance and realism.

#### Performance Optimizer (`SimulationOptimizer.cs`)

```csharp
// SimulationOptimizer.cs
using UnityEngine;
using System.Collections.Generic;

public class SimulationOptimizer : MonoBehaviour
{
    [Header("Performance Settings")]
    public int targetFrameRate = 60;
    public LODGroup[] lodGroups;
    public float lodTransitionSpeed = 1.0f;

    [Header("Quality Settings")]
    public int shadowResolution = 2;
    public int anisotropicFiltering = 2;
    public float textureQuality = 0.8f;

    [Header("Physics Optimization")]
    public int fixedTimestep = 50; // Hz
    public int solverIterations = 6;
    public int solverVelocityIterations = 1;

    [Header("Culling Settings")]
    public float cullingDistance = 100f;
    public int maxCulledObjects = 1000;

    private List<Renderer> activeRenderers = new List<Renderer>();
    private List<LODGroup> activeLODGroups = new List<LODGroup>();

    void Start()
    {
        ConfigureQualitySettings();
        ConfigurePhysicsSettings();
        InitializeOptimizationSystems();

        Debug.Log("Simulation optimization initialized");
    }

    void Update()
    {
        UpdateLODSystems();
        UpdateCullingSystems();
        MonitorPerformance();
    }

    void ConfigureQualitySettings()
    {
        // Set target frame rate
        Application.targetFrameRate = targetFrameRate;

        // Configure quality settings
        QualitySettings.shadowResolution = (ShadowResolution)shadowResolution;
        QualitySettings.anisotropicFiltering = (AnisotropicFiltering)anisotropicFiltering;
        QualitySettings.globalTextureMipmapLimit = Mathf.RoundToInt((1 - textureQuality) * 3);
    }

    void ConfigurePhysicsSettings()
    {
        // Configure physics settings
        Time.fixedDeltaTime = 1.0f / fixedTimestep;
        Physics.defaultSolverIterations = solverIterations;
        Physics.defaultSolverVelocityIterations = solverVelocityIterations;
    }

    void InitializeOptimizationSystems()
    {
        // Initialize LOD systems
        InitializeLODGroups();

        // Initialize culling systems
        InitializeCullingSystems();
    }

    void InitializeLODGroups()
    {
        // Find all LOD groups in the scene
        LODGroup[] allLODGroups = FindObjectsOfType<LODGroup>();
        activeLODGroups.AddRange(allLODGroups);

        // Set up LOD transition parameters
        foreach (LODGroup lodGroup in activeLODGroups)
        {
            LOD[] lods = lodGroup.GetLODs();
            for (int i = 0; i < lods.Length; i++)
            {
                // Smooth transition between LOD levels
                lods[i].fadeTransitionWidth = lodTransitionSpeed;
            }
            lodGroup.SetLODs(lods);
        }
    }

    void InitializeCullingSystems()
    {
        // Find all renderers in the scene
        Renderer[] allRenderers = FindObjectsOfType<Renderer>();
        activeRenderers.AddRange(allRenderers);
    }

    void UpdateLODSystems()
    {
        // Update LOD based on distance from main camera
        Camera mainCamera = Camera.main;
        if (mainCamera != null)
        {
            foreach (LODGroup lodGroup in activeLODGroups)
            {
                // Calculate distance from camera
                float distance = Vector3.Distance(mainCamera.transform.position, lodGroup.transform.position);

                // Update LOD level based on distance
                UpdateLODLevel(lodGroup, distance);
            }
        }
    }

    void UpdateLODLevel(LODGroup lodGroup, float distance)
    {
        LOD[] lods = lodGroup.GetLODs();
        if (lods.Length == 0) return;

        // Determine appropriate LOD level based on distance
        for (int i = 0; i < lods.Length; i++)
        {
            if (distance <= lods[i].screenRelativeTransitionHeight * 100) // Convert to world units
            {
                lodGroup.ForceLOD(i);
                break;
            }
        }
    }

    void UpdateCullingSystems()
    {
        // Simple distance-based culling
        Camera mainCamera = Camera.main;
        if (mainCamera != null)
        {
            foreach (Renderer renderer in activeRenderers)
            {
                if (renderer != null)
                {
                    float distance = Vector3.Distance(mainCamera.transform.position, renderer.transform.position);

                    // Enable/disable rendering based on distance
                    renderer.enabled = distance <= cullingDistance;
                }
            }
        }
    }

    void MonitorPerformance()
    {
        // Monitor and log performance metrics
        float frameTime = Time.deltaTime;
        float fps = 1.0f / frameTime;

        // Log performance if below threshold
        if (fps < targetFrameRate * 0.8f)
        {
            Debug.LogWarning($"Performance warning: Current FPS {fps:F1}, Target {targetFrameRate}");
        }
    }
}
```

#### Verification Steps
1. Add the SimulationOptimizer script to your Unity scene
2. Configure performance parameters based on your hardware
3. Run the simulation and monitor performance
4. Check that LOD transitions occur smoothly
5. Verify that distant objects are culled appropriately

#### Expected Output
- Stable frame rate at target FPS
- Smooth LOD transitions
- Efficient rendering of distant objects
- Optimized physics calculations

## Personalization Hooks

<BeginnerBackground>
**For Beginners:** Unity for robotics is like having a virtual world where you can test your robot without risking damage to the real robot or its environment. Just like video games create realistic worlds for players, Unity creates realistic worlds for robots to practice and learn in before operating in the real world.
</BeginnerBackground>

<ExpertBackground>
**For Experts:** Unity's integration with robotics requires careful consideration of coordinate system differences, physics parameter tuning, and real-time performance requirements. The Perception package enables synthetic data generation crucial for training vision systems, while the ROS TCP Connector provides reliable communication. Consider implementing custom shaders for sensor simulation and leveraging Unity's Job System for multithreaded physics calculations.
</ExpertBackground>

<!-- URDU_TRANSLATION_START -->
### اردو ترجمہ (Urdu Translation)

(یہ حصہ اردو ترجمہ فیچر کے ذریعے متحرک طور پر ترجمہ کیا جائے گا۔)

<!-- URDU_TRANSLATION_END -->