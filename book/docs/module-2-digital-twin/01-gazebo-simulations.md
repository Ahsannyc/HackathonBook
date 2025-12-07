---
title: Gazebo Simulations
sidebar_label: Gazebo Simulations
sidebar_position: 1
personalization_hooks: true
urdu_translation_trigger: true
---

# Gazebo Simulations: Digital Twin for Robotics

## Introduction to Gazebo Simulation Environment

Gazebo is a powerful 3D simulation environment that provides realistic physics, high-quality graphics, and convenient programmatic interfaces. It's an essential tool in robotics development, allowing engineers and researchers to test algorithms, train robots, and validate systems in a safe, controlled, and cost-effective virtual environment before deploying to real hardware.

Gazebo simulates rigid body dynamics, sensors, and environmental conditions with remarkable accuracy. It supports a wide variety of robot models and sensors, including cameras, lidars, IMUs, and force-torque sensors. The simulation environment can model complex scenarios with multiple robots, dynamic objects, and realistic lighting conditions.

### Key Features of Gazebo
- **Physics Engine**: Uses ODE (Open Dynamics Engine), Bullet, or DART for accurate physics simulation
- **Sensor Simulation**: Realistic simulation of cameras, lidars, GPS, IMU, and other sensors
- **Plugin Architecture**: Extensible through plugins for custom sensors, controllers, and world modifications
- **ROS Integration**: Seamless integration with ROS/ROS 2 for robotics development workflows
- **World Editor**: Tools for creating and modifying simulation environments

## Gazebo in Robotics Education

Gazebo's realistic simulation capabilities make it an invaluable tool for robotics education. Students can experiment with complex robotic systems without the constraints of physical hardware, enabling rapid prototyping and testing of algorithms. The ability to run multiple simulation instances simultaneously allows for collaborative learning and comparative studies of different approaches. For further reading on the application of simulation in robotics education, consider the following peer-reviewed articles: [1] Koenig, N., & Howard, A. (2004). *Design and use paradigms for Gazebo, an open-source multi-robot simulator*. IEEE/RSJ International Conference on Intelligent Robots and Systems. [2] Kolar, D., et al. (2019). *Simulation in robotics education: A systematic review*. Robotics and Autonomous Systems.

## Gazebo Simulation Examples

Here are fundamental Gazebo simulation examples to get you started. Each example includes setup instructions, configuration files, and verification steps.

### 1. Basic Gazebo World Setup

This example demonstrates how to create a simple Gazebo world with basic objects and run a simulation.

#### World File (`basic_world.world`)

```xml
<?xml version="1.0" ?>
<sdf version="1.6">
  <world name="basic_world">
    <!-- Include a default ground plane and lighting -->
    <include>
      <uri>model://ground_plane</uri>
    </include>
    <include>
      <uri>model://sun</uri>
    </include>

    <!-- Create a simple box object -->
    <model name="box">
      <pose>2 2 0.5 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
          <material>
            <ambient>1 0 0 1</ambient>
            <diffuse>1 0 0 1</diffuse>
          </material>
        </visual>
      </link>
    </model>

    <!-- Create a simple cylinder object -->
    <model name="cylinder">
      <pose>-2 2 0.5 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <cylinder>
              <radius>0.5</radius>
              <length>1</length>
            </cylinder>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <cylinder>
              <radius>0.5</radius>
              <length>1</length>
            </cylinder>
          </geometry>
          <material>
            <ambient>0 1 0 1</ambient>
            <diffuse>0 1 0 1</diffuse>
          </material>
        </visual>
      </link>
    </model>
  </world>
</sdf>
```

#### Verification Steps
1. Save the world file as `basic_world.world` in your Gazebo worlds directory (typically `~/.gazebo/models/` or your project directory)
2. Launch Gazebo with the custom world:
   ```bash
   gazebo basic_world.world
   ```
3. Observe the red box and green cylinder in the simulation environment
4. Use the Gazebo interface to move around the world and inspect the objects

#### Expected Output
- Gazebo GUI opens with the custom world
- Red box and green cylinder appear in the simulation
- Objects respond to physics (if they were positioned to fall or interact)

### 2. Robot Model in Gazebo

This example demonstrates how to load a simple robot model into Gazebo and control it.

#### Robot URDF (`simple_robot.urdf`)

```xml
<?xml version="1.0"?>
<robot name="simple_robot">
  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.5 0.5 0.2"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.5 0.5 0.2"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.083" ixy="0.0" ixz="0.0" iyy="0.083" iyz="0.0" izz="0.083"/>
    </inertial>
  </link>

  <!-- Left wheel -->
  <link name="left_wheel">
    <visual>
      <geometry>
        <cylinder radius="0.1" length="0.05"/>
      </geometry>
      <material name="black">
        <color rgba="0 0 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.1" length="0.05"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.1"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.0005"/>
    </inertial>
  </link>

  <!-- Right wheel -->
  <link name="right_wheel">
    <visual>
      <geometry>
        <cylinder radius="0.1" length="0.05"/>
      </geometry>
      <material name="black">
        <color rgba="0 0 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.1" length="0.05"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.1"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.0005"/>
    </inertial>
  </link>

  <!-- Joints -->
  <joint name="left_wheel_joint" type="continuous">
    <parent link="base_link"/>
    <child link="left_wheel"/>
    <origin xyz="0 0.3 0" rpy="1.570796 0 0"/>
    <axis xyz="0 0 1"/>
  </joint>

  <joint name="right_wheel_joint" type="continuous">
    <parent link="base_link"/>
    <child link="right_wheel"/>
    <origin xyz="0 -0.3 0" rpy="1.570796 0 0"/>
    <axis xyz="0 0 1"/>
  </joint>

  <!-- Gazebo plugin for differential drive -->
  <gazebo>
    <plugin name="differential_drive" filename="libgazebo_ros_diff_drive.so">
      <left_joint>left_wheel_joint</left_joint>
      <right_joint>right_wheel_joint</right_joint>
      <wheel_separation>0.6</wheel_separation>
      <wheel_diameter>0.2</wheel_diameter>
      <command_topic>cmd_vel</command_topic>
      <odometry_topic>odom</odometry_topic>
      <odometry_frame>odom</odometry_frame>
      <robot_base_frame>base_link</robot_base_frame>
    </plugin>
  </gazebo>
</robot>
```

#### Launch File (`robot_sim.launch`)

```xml
<launch>
  <!-- Load the robot description parameter -->
  <param name="robot_description" command="$(find xacro)/xacro --inorder '$(find my_robot)/urdf/simple_robot.urdf'" />

  <!-- Spawn the robot in Gazebo -->
  <node name="spawn_urdf" pkg="gazebo_ros" type="spawn_model" args="-param robot_description -urdf -model simple_robot" />

  <!-- Launch Gazebo with an empty world -->
  <include file="$(find gazebo_ros)/launch/empty_world.launch">
    <arg name="paused" value="false"/>
    <arg name="use_sim_time" value="true"/>
    <arg name="gui" value="true"/>
    <arg name="headless" value="false"/>
    <arg name="debug" value="false"/>
  </include>
</launch>
```

#### Verification Steps
1. Create a ROS package for your robot (e.g., `my_robot`)
2. Save the URDF file in the `urdf` directory of your package
3. Launch the simulation:
   ```bash
   roslaunch my_robot robot_sim.launch
   ```
4. Send velocity commands to control the robot:
   ```bash
   rostopic pub /cmd_vel geometry_msgs/Twist "linear:
     x: 0.5
     y: 0.0
     z: 0.0
   angular:
     x: 0.0
     y: 0.0
     z: 0.2" -r 10
   ```

#### Expected Output
- Robot model appears in Gazebo
- Robot moves forward and rotates as commanded
- Odometry data is published to `/odom` topic

### 3. Sensor Integration in Gazebo

This example demonstrates how to add sensors to your robot model and visualize sensor data.

#### Robot with Camera URDF (`robot_with_camera.urdf`)

```xml
<?xml version="1.0"?>
<robot name="robot_with_camera">
  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.5 0.3 0.2"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.5 0.3 0.2"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.083" ixy="0.0" ixz="0.0" iyy="0.083" iyz="0.0" izz="0.083"/>
    </inertial>
  </link>

  <!-- Camera link -->
  <link name="camera_link">
    <visual>
      <geometry>
        <box size="0.05 0.05 0.05"/>
      </geometry>
      <material name="red">
        <color rgba="1 0 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.05 0.05 0.05"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.01"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <!-- Camera joint -->
  <joint name="camera_joint" type="fixed">
    <parent link="base_link"/>
    <child link="camera_link"/>
    <origin xyz="0.2 0 0.1" rpy="0 0 0"/>
  </joint>

  <!-- Gazebo plugins -->
  <gazebo reference="camera_link">
    <sensor type="camera" name="camera1">
      <update_rate>30.0</update_rate>
      <camera name="head">
        <horizontal_fov>1.3962634</horizontal_fov>
        <image>
          <width>800</width>
          <height>600</height>
          <format>R8G8B8</format>
        </image>
        <clip>
          <near>0.02</near>
          <far>300</far>
        </clip>
      </camera>
      <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
        <alwaysOn>true</alwaysOn>
        <updateRate>0.0</updateRate>
        <cameraName>my_camera</cameraName>
        <imageTopicName>image_raw</imageTopicName>
        <cameraInfoTopicName>camera_info</cameraInfoTopicName>
        <frameName>camera_link</frameName>
        <hackBaseline>0.07</hackBaseline>
        <distortionK1>0.0</distortionK1>
        <distortionK2>0.0</distortionK2>
        <distortionK3>0.0</distortionK3>
        <distortionT1>0.0</distortionT1>
        <distortionT2>0.0</distortionT2>
      </plugin>
    </sensor>
  </gazebo>
</robot>
```

#### Verification Steps
1. Save the URDF with camera in your robot package
2. Launch the simulation with the camera-equipped robot
3. Visualize the camera feed:
   ```bash
   rosrun image_view image_view image:=/my_camera/image_raw
   ```
4. Check the camera info:
   ```bash
   rostopic echo /my_camera/camera_info
   ```

#### Expected Output
- Robot with camera appears in Gazebo
- Camera feed is published to `/my_camera/image_raw`
- Image view window shows the camera's perspective

### 4. Custom Gazebo Plugin Example

This example shows how to create a custom plugin for Gazebo that adds functionality to your simulation.

#### Plugin Header (`custom_force_plugin.h`)

```cpp
#ifndef CUSTOM_FORCE_PLUGIN_HH
#define CUSTOM_FORCE_PLUGIN_HH

#include <gazebo/gazebo.hh>
#include <gazebo/physics/physics.hh>
#include <gazebo/common/common.hh>

namespace gazebo
{
  class CustomForcePlugin : public ModelPlugin
  {
    public: void Load(physics::ModelPtr _model, sdf::ElementPtr _sdf);
    public: void OnUpdate();

    private: physics::ModelPtr model;
    private: physics::LinkPtr link;
    private: event::ConnectionPtr updateConnection;
    private: common::Time lastUpdateTime;
  };
}

#endif
```

#### Plugin Implementation (`custom_force_plugin.cpp`)

```cpp
#include "custom_force_plugin.h"

namespace gazebo
{
  void CustomForcePlugin::Load(physics::ModelPtr _model, sdf::ElementPtr _sdf)
  {
    // Store the model pointer for convenience
    this->model = _model;

    // Get the first link (or a specific link if named)
    this->link = this->model->GetLink();

    // Listen to the update event. This event is broadcast every
    // simulation iteration.
    this->updateConnection = event::Events::ConnectWorldUpdateBegin(
        std::bind(&CustomForcePlugin::OnUpdate, this));

    gzdbg << "CustomForcePlugin loaded for model [" << _model->GetName() << "]\n";
  }

  void CustomForcePlugin::OnUpdate()
  {
    // Apply a small upward force to counteract gravity
    // This will make the object float
    math::Vector3 force(0, 0, 0.5);
    this->link->AddForce(force);
  }
}

// Register this plugin with the simulator
GZ_REGISTER_MODEL_PLUGIN(CustomForcePlugin)
```

#### Robot with Plugin (`robot_with_plugin.urdf`)

```xml
<?xml version="1.0"?>
<robot name="robot_with_plugin">
  <link name="floating_object">
    <visual>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
      <material name="yellow">
        <color rgba="1 1 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.1"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <gazebo>
    <plugin name="custom_force_plugin" filename="libCustomForcePlugin.so"/>
  </gazebo>
</robot>
```

#### Verification Steps
1. Compile the plugin following Gazebo plugin compilation guidelines
2. Save the URDF with the plugin reference
3. Launch the simulation with the plugin-equipped object
4. Observe the floating behavior of the object

#### Expected Output
- Object floats in the simulation instead of falling due to gravity
- Plugin loads successfully without errors

### 5. Multi-Robot Simulation

This example demonstrates how to simulate multiple robots in the same Gazebo world.

#### World with Multiple Robots (`multi_robot.world`)

```xml
<?xml version="1.0" ?>
<sdf version="1.6">
  <world name="multi_robot_world">
    <!-- Include ground plane and sun -->
    <include>
      <uri>model://ground_plane</uri>
    </include>
    <include>
      <uri>model://sun</uri>
    </include>

    <!-- Robot 1 -->
    <model name="robot1">
      <pose>0 0 0.5 0 0 0</pose>
      <include>
        <uri>model://roomba</uri>
      </include>
    </model>

    <!-- Robot 2 -->
    <model name="robot2">
      <pose>2 0 0.5 0 0 1.57</pose>
      <include>
        <uri>model://roomba</uri>
      </include>
    </model>

    <!-- Robot 3 -->
    <model name="robot3">
      <pose>-2 0 0.5 0 0 -1.57</pose>
      <include>
        <uri>model://roomba</uri>
      </include>
    </model>

    <!-- A static obstacle -->
    <model name="obstacle">
      <pose>0 2 0.5 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>1 0.2 1</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>1 0.2 1</size>
            </box>
          </geometry>
          <material>
            <ambient>0.5 0.5 0.5 1</ambient>
            <diffuse>0.5 0.5 0.5 1</diffuse>
          </material>
        </visual>
      </link>
    </model>
  </world>
</sdf>
```

#### Launch File (`multi_robot.launch`)

```xml
<launch>
  <!-- Launch Gazebo with the multi-robot world -->
  <include file="$(find gazebo_ros)/launch/empty_world.launch">
    <arg name="world_name" value="$(find my_robot)/worlds/multi_robot.world"/>
    <arg name="paused" value="false"/>
    <arg name="use_sim_time" value="true"/>
    <arg name="gui" value="true"/>
    <arg name="headless" value="false"/>
    <arg name="debug" value="false"/>
  </include>

  <!-- Launch controllers for each robot -->
  <group ns="robot1">
    <param name="robot_description" command="$(find xacro)/xacro --inorder '$(find my_robot)/urdf/robot1.urdf'" />
    <node name="spawn_urdf" pkg="gazebo_ros" type="spawn_model" args="-param robot_description -urdf -model robot1 -x 0 -y 0 -z 0.5" />
    <node name="robot_state_publisher" pkg="robot_state_publisher" type="robot_state_publisher" />
  </group>

  <group ns="robot2">
    <param name="robot_description" command="$(find xacro)/xacro --inorder '$(find my_robot)/urdf/robot2.urdf'" />
    <node name="spawn_urdf" pkg="gazebo_ros" type="spawn_model" args="-param robot_description -urdf -model robot2 -x 2 -y 0 -z 0.5" />
    <node name="robot_state_publisher" pkg="robot_state_publisher" type="robot_state_publisher" />
  </group>

  <group ns="robot3">
    <param name="robot_description" command="$(find xacro)/xacro --inorder '$(find my_robot)/urdf/robot3.urdf'" />
    <node name="spawn_urdf" pkg="gazebo_ros" type="spawn_model" args="-param robot_description -urdf -model robot3 -x -2 -y 0 -z 0.5" />
    <node name="robot_state_publisher" pkg="robot_state_publisher" type="robot_state_publisher" />
  </group>
</launch>
```

#### Verification Steps
1. Create URDF files for each robot (robot1.urdf, robot2.urdf, robot3.urdf)
2. Save the world file and launch file in appropriate directories
3. Launch the multi-robot simulation:
   ```bash
   roslaunch my_robot multi_robot.launch
   ```
4. Control each robot separately using namespaced topics (e.g., `/robot1/cmd_vel`, `/robot2/cmd_vel`)

#### Expected Output
- Three robots appear in the simulation environment
- Each robot can be controlled independently
- Robots interact with each other and the environment according to physics

## Personalization Hooks

<BeginnerBackground>
**For Beginners:** Think of Gazebo as a video game engine designed for robotics. Just like in video games, you can create different "levels" (worlds) with various objects, and control "characters" (robots) within these environments. The difference is that Gazebo accurately simulates physics, so the robot behaviors in simulation closely match how they would behave in the real world.
</BeginnerBackground>

<ExpertBackground>
**For Experts:** Gazebo's plugin architecture and physics engine integration allow for sophisticated simulation scenarios including dynamic environments, sensor noise modeling, and realistic multi-body dynamics. Consider exploring custom physics engine configurations and advanced sensor models for high-fidelity simulation requirements. The ROS/Gazebo integration through `gazebo_ros` packages provides direct access to simulation state for algorithm development and testing.
</ExpertBackground>

<!-- URDU_TRANSLATION_START -->
### اردو ترجمہ (Urdu Translation)

(یہ حصہ اردو ترجمہ فیچر کے ذریعے متحرک طور پر ترجمہ کیا جائے گا۔)

<!-- URDU_TRANSLATION_END -->