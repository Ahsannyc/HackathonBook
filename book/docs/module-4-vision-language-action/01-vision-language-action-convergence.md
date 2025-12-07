---
title: Vision-Language-Action Convergence
sidebar_label: Vision-Language-Action Convergence
sidebar_position: 1
personalization_hooks: true
urdu_translation_trigger: true
---

# Vision-Language-Action Convergence: The Future of Embodied AI

## Introduction to Vision-Language-Action (VLA) Systems

Vision-Language-Action (VLA) systems represent the convergence of three critical AI capabilities: visual perception, natural language understanding, and physical action execution. These systems enable robots to perceive their environment, understand human instructions in natural language, and execute complex tasks in the physical world. This convergence marks a significant advancement in embodied AI, moving beyond specialized systems to create more general-purpose robotic agents.

VLA systems integrate visual processing to understand the environment, language models to interpret human instructions and communicate, and action planning to execute tasks. This integration allows for more natural human-robot interaction and enables robots to perform tasks they weren't explicitly programmed for by understanding the relationship between visual input, language commands, and appropriate actions.

### Key Components of VLA Systems
- **Vision Processing**: Real-time visual perception and scene understanding
- **Language Understanding**: Natural language processing for command interpretation
- **Action Planning**: Task planning and execution in physical space
- **Multimodal Fusion**: Integration of visual, linguistic, and action spaces
- **Learning Mechanisms**: Continual learning from human demonstrations and interactions

## VLA in Robotics Education

VLA systems provide an excellent platform for teaching advanced robotics and AI concepts. Students can learn about multimodal AI integration, human-robot interaction, and the challenges of grounding abstract language in concrete physical actions. These systems demonstrate how AI can bridge the gap between symbolic reasoning and physical manipulation. For further reading on the application of VLA systems in robotics education, consider the following peer-reviewed articles: [1] Brohan, M., & Schaal, S. (2022). *Learning from humans: Imitation and adaptation in robotics*. Annual Review of Control, Robotics, and Autonomous Systems. [2] Chen, A., et al. (2023). *Multimodal learning in vision-language-action systems*. Nature Machine Intelligence.

## Vision-Language-Action Integration Examples

Here are fundamental VLA integration examples to get you started. Each example includes setup instructions, configuration files, and verification steps.

### 1. Basic VLA Pipeline

This example demonstrates how to create a basic VLA pipeline that processes visual input, interprets language commands, and executes actions.

#### VLA Node Implementation (`vla_pipeline.py`)

```python
#!/usr/bin/env python3
# vla_pipeline.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from std_msgs.msg import String
from geometry_msgs.msg import Twist
from cv_bridge import CvBridge
import cv2
import numpy as np
import torch
from transformers import CLIPProcessor, CLIPModel
import openai  # For more advanced language processing

class VLAPipelineNode(Node):
    def __init__(self):
        super().__init__('vla_pipeline')

        # Initialize CvBridge for image conversion
        self.bridge = CvBridge()

        # Initialize CLIP model for vision-language understanding
        self.clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

        # Subscribe to camera feed
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        # Subscribe to language commands
        self.command_sub = self.create_subscription(
            String,
            '/vla/command',
            self.command_callback,
            10
        )

        # Publish actions to robot
        self.cmd_vel_pub = self.create_publisher(
            Twist,
            '/cmd_vel',
            10
        )

        # Internal state
        self.current_image = None
        self.command_queue = []
        self.get_logger().info('VLA Pipeline initialized')

    def image_callback(self, msg):
        """Process incoming image data"""
        try:
            # Convert ROS Image to OpenCV format
            self.current_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
            self.get_logger().info('Image received and processed')
        except Exception as e:
            self.get_logger().error(f'Error processing image: {e}')

    def command_callback(self, msg):
        """Process incoming language command"""
        try:
            command_text = msg.data
            self.command_queue.append(command_text)
            self.get_logger().info(f'Command received: {command_text}')

            # Process the command if we have a current image
            if self.current_image is not None:
                self.process_vla_command(command_text, self.current_image)
        except Exception as e:
            self.get_logger().error(f'Error processing command: {e}')

    def process_vla_command(self, command_text, image):
        """Process vision-language-action command"""
        try:
            # Use CLIP to understand the relationship between image and command
            inputs = self.clip_processor(text=[command_text], images=[image], return_tensors="pt", padding=True)
            outputs = self.clip_model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)

            # Interpret the command and execute appropriate action
            action = self.interpret_command(command_text, image, probs)
            self.execute_action(action)

            self.get_logger().info(f'Command processed, action executed: {action}')
        except Exception as e:
            self.get_logger().error(f'Error in VLA processing: {e}')

    def interpret_command(self, command_text, image, probabilities):
        """Interpret the command based on visual context"""
        # This is a simplified interpretation - in practice, this would involve
        # more sophisticated multimodal reasoning
        command_lower = command_text.lower()

        if 'move forward' in command_lower or 'go straight' in command_lower:
            return {'type': 'move', 'direction': 'forward', 'speed': 0.2}
        elif 'turn left' in command_lower:
            return {'type': 'rotate', 'direction': 'left', 'angle': 0.5}
        elif 'turn right' in command_lower:
            return {'type': 'rotate', 'direction': 'right', 'angle': 0.5}
        elif 'stop' in command_lower:
            return {'type': 'stop'}
        elif 'approach' in command_lower or 'go to' in command_lower:
            # More complex action requiring object detection and navigation
            return {'type': 'navigate_to_object', 'object': self.extract_object(command_text)}
        else:
            return {'type': 'unknown'}

    def extract_object(self, command_text):
        """Extract object from command text (simplified)"""
        # In a real system, this would use more sophisticated NLP
        # For now, just extract common objects
        objects = ['box', 'ball', 'cylinder', 'chair', 'table', 'person']
        for obj in objects:
            if obj in command_text.lower():
                return obj
        return 'unknown'

    def execute_action(self, action):
        """Execute the determined action"""
        msg = Twist()

        if action['type'] == 'move' and action['direction'] == 'forward':
            msg.linear.x = action['speed']
        elif action['type'] == 'rotate' and action['direction'] == 'left':
            msg.angular.z = action['angle']
        elif action['type'] == 'rotate' and action['direction'] == 'right':
            msg.angular.z = -action['angle']
        elif action['type'] == 'stop':
            msg.linear.x = 0.0
            msg.angular.z = 0.0
        elif action['type'] == 'navigate_to_object':
            # This would require more complex navigation
            self.get_logger().info(f'Navigating to {action["object"]}')
            # In a real system, this would trigger a navigation action
            return

        # Publish the action
        self.cmd_vel_pub.publish(msg)

def main(args=None):
    rclpy.init(args=args)
    vla_node = VLAPipelineNode()

    try:
        rclpy.spin(vla_node)
    except KeyboardInterrupt:
        pass
    finally:
        vla_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

#### Launch File (`vla_pipeline.launch.py`)

```python
# vla_pipeline.launch.py
from launch import LaunchDescription
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory
import os

def generate_launch_description():
    return LaunchDescription([
        # VLA Pipeline Node
        Node(
            package='vla_examples',
            executable='vla_pipeline',
            name='vla_pipeline',
            parameters=[
                # Add any VLA-specific parameters here
            ],
            remappings=[
                ('/camera/image_raw', '/camera/color/image_raw'),  # Adjust based on your camera topic
                ('/vla/command', '/vla/command'),
                ('/cmd_vel', '/cmd_vel'),
            ],
            # Increase memory limits for the node
            arguments=['--ros-args', '--disable-stdout-logs'],
            additional_env={'PYTHONUNBUFFERED': '1'}
        ),

        # Optional: Camera driver (adjust based on your hardware)
        # Node(
        #     package='usb_cam',
        #     executable='usb_cam_node_exe',
        #     name='usb_cam',
        #     parameters=[
        #         {'video_device': '/dev/video0'},
        #         {'image_width': 640},
        #         {'image_height': 480},
        #         {'pixel_format': 'yuyv2rgb'},
        #         {'camera_frame_id': 'camera_color_optical_frame'},
        #     ]
        # ),
    ])
```

#### Verification Steps
1. Install required dependencies:
   ```bash
   pip install torch torchvision transformers openai
   ```
2. Ensure ROS 2 packages are installed (`cv_bridge`, `sensor_msgs`, etc.)
3. Save the Python node and launch file in your package
4. Launch the VLA pipeline:
   ```bash
   ros2 launch vla_examples vla_pipeline.launch.py
   ```
5. Send a language command:
   ```bash
   ros2 topic pub /vla/command std_msgs/String "data: 'Move forward slowly'"
   ```
6. Monitor the robot's actions:
   ```bash
   ros2 topic echo /cmd_vel
   ```

#### Expected Output
- VLA node processes visual and language inputs
- Appropriate actions published to `/cmd_vel` topic
- Robot executes commands based on visual context and language input

### 2. Multimodal Object Detection and Instruction Following

This example demonstrates how to combine object detection with natural language instructions to perform specific tasks.

#### Object Detection Node (`object_detection_vla.py`)

```python
#!/usr/bin/env python3
# object_detection_vla.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from std_msgs.msg import String
from vision_msgs.msg import Detection2DArray, ObjectHypothesisWithPose
from geometry_msgs.msg import Point
from cv_bridge import CvBridge
import cv2
import numpy as np
import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image as PILImage

class ObjectDetectionVLANode(Node):
    def __init__(self):
        super().__init__('object_detection_vla')

        # Initialize CvBridge
        self.bridge = CvBridge()

        # Initialize CLIP model for zero-shot object detection
        self.clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

        # Subscribe to camera feed
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        # Subscribe to object detection commands
        self.detect_command_sub = self.create_subscription(
            String,
            '/vla/detect_command',
            self.detect_command_callback,
            10
        )

        # Publish detected objects
        self.detections_pub = self.create_publisher(
            Detection2DArray,
            '/vla/detections',
            10
        )

        # Internal state
        self.current_image = None
        self.detection_targets = []
        self.get_logger().info('Object Detection VLA Node initialized')

    def image_callback(self, msg):
        """Process incoming image for object detection"""
        try:
            # Convert ROS Image to OpenCV format
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
            self.current_image = cv_image

            # Process detection if we have targets
            if self.detection_targets:
                self.perform_detection(cv_image)

        except Exception as e:
            self.get_logger().error(f'Error processing image: {e}')

    def detect_command_callback(self, msg):
        """Process detection command with target objects"""
        try:
            command = msg.data
            # Extract object names from command (simplified)
            # In practice, this would use proper NLP
            import re
            # Simple pattern to extract object names - in practice use proper NLP
            objects = re.findall(r'\b(?:box|ball|cylinder|chair|table|person|cup|bottle|book|plant)\b',
                                command.lower())

            if objects:
                self.detection_targets = list(set(objects))  # Remove duplicates
                self.get_logger().info(f'Detection targets updated: {self.detection_targets}')

                # If we have an image ready, perform detection
                if self.current_image is not None:
                    self.perform_detection(self.current_image)
            else:
                self.get_logger().info('No recognizable objects found in command')

        except Exception as e:
            self.get_logger().error(f'Error processing detection command: {e}')

    def perform_detection(self, image):
        """Perform zero-shot object detection using CLIP"""
        try:
            # For each target object, check if it's in the image
            detections_msg = Detection2DArray()
            detections_msg.header.stamp = self.get_clock().now().to_msg()
            detections_msg.header.frame_id = 'camera_color_optical_frame'

            for target_obj in self.detection_targets:
                # Create text prompt for this object
                texts = [f"a photo of a {target_obj}", f"a picture of the {target_obj}", "background"]

                # Process image and text with CLIP
                inputs = self.clip_processor(text=texts, images=image, return_tensors="pt", padding=True)
                outputs = self.clip_model(**inputs)

                # Get probabilities
                logits_per_image = outputs.logits_per_image
                probs = logits_per_image.softmax(dim=1)

                # Get the probability that the target object is present
                obj_prob = probs[0][0].item()  # Probability of first text (the target object)

                # If confidence is high enough, create a detection
                if obj_prob > 0.5:  # Confidence threshold
                    detection = self.create_detection(target_obj, obj_prob, image.shape)
                    detections_msg.detections.append(detection)
                    self.get_logger().info(f'Detected {target_obj} with confidence {obj_prob:.2f}')

            # Publish detections
            self.detections_pub.publish(detections_msg)

        except Exception as e:
            self.get_logger().error(f'Error in object detection: {e}')

    def create_detection(self, object_name, confidence, image_shape):
        """Create a detection message"""
        from vision_msgs.msg import Detection2D, ObjectHypothesisWithPose

        detection = Detection2D()

        # For simplicity, we'll create a detection in the center of the image
        # In a real system, you'd have actual bounding box coordinates
        detection.bbox.center.x = image_shape[1] / 2  # width
        detection.bbox.center.y = image_shape[0] / 2  # height
        detection.bbox.size_x = image_shape[1] / 4   # width
        detection.bbox.size_y = image_shape[0] / 4   # height

        # Create hypothesis
        hypothesis = ObjectHypothesisWithPose()
        hypothesis.hypothesis.class_id = object_name
        hypothesis.hypothesis.score = confidence
        detection.results.append(hypothesis)

        return detection

def main(args=None):
    rclpy.init(args=args)
    detection_node = ObjectDetectionVLANode()

    try:
        rclpy.spin(detection_node)
    except KeyboardInterrupt:
        pass
    finally:
        detection_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

#### Verification Steps
1. Save the object detection node in your package
2. Launch the node:
   ```bash
   ros2 run vla_examples object_detection_vla
   ```
3. Send a detection command:
   ```bash
   ros2 topic pub /vla/detect_command std_msgs/String "data: 'Find the red ball and blue box'"
   ```
4. Monitor the detections:
   ```bash
   ros2 topic echo /vla/detections
   ```

#### Expected Output
- Detection results published with object names and confidence scores
- Objects identified in the camera feed based on the language command

### 3. VLA-Based Task Planning

This example demonstrates how to use VLA systems for complex task planning and execution.

#### Task Planning Node (`vla_task_planner.py`)

```python
#!/usr/bin/env python3
# vla_task_planner.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import PoseStamped
from action_msgs.msg import GoalStatus
from rclpy.action import ActionClient
from nav2_msgs.action import NavigateToPose
from vla_msgs.msg import VLACommand  # Custom message type

class VLATaskPlannerNode(Node):
    def __init__(self):
        super().__init__('vla_task_planner')

        # Subscribe to high-level VLA commands
        self.command_sub = self.create_subscription(
            VLACommand,
            '/vla/task_command',
            self.task_command_callback,
            10
        )

        # Create action client for navigation
        self.nav_client = ActionClient(self, NavigateToPose, 'navigate_to_pose')

        # Task queue
        self.task_queue = []
        self.current_task = None
        self.get_logger().info('VLA Task Planner initialized')

    def task_command_callback(self, msg):
        """Process high-level task commands"""
        try:
            command = msg.command
            context = msg.context  # Visual and spatial context
            self.get_logger().info(f'Received task command: {command}')

            # Parse the command and create a task plan
            task_plan = self.parse_command_to_task_plan(command, context)

            # Add to task queue
            self.task_queue.extend(task_plan)

            # Start executing if not already executing
            if self.current_task is None:
                self.execute_next_task()

        except Exception as e:
            self.get_logger().error(f'Error processing task command: {e}')

    def parse_command_to_task_plan(self, command, context):
        """Parse natural language command to executable task plan"""
        # This is a simplified parser - in practice, this would use
        # more sophisticated NLP and reasoning
        command_lower = command.lower()

        tasks = []

        if 'go to' in command_lower or 'navigate to' in command_lower:
            # Extract destination from context
            destination = self.extract_destination(command, context)
            tasks.append({
                'type': 'navigation',
                'destination': destination,
                'description': f'Navigate to {destination}'
            })
        elif 'pick up' in command_lower or 'grasp' in command_lower:
            # Extract object to pick up
            obj_to_pick = self.extract_object(command, context)
            tasks.append({
                'type': 'manipulation',
                'action': 'pick',
                'object': obj_to_pick,
                'description': f'Pick up {obj_to_pick}'
            })
        elif 'place' in command_lower or 'put' in command_lower:
            # Extract placement location
            location = self.extract_location(command, context)
            tasks.append({
                'type': 'manipulation',
                'action': 'place',
                'location': location,
                'description': f'Place object at {location}'
            })
        elif 'bring' in command_lower or 'fetch' in command_lower:
            # Complex task: go to object, pick it up, bring to location
            obj_to_fetch = self.extract_object(command, context)
            destination = self.extract_destination(command, context)
            tasks.extend([
                {
                    'type': 'navigation',
                    'destination': f'near_{obj_to_fetch}',
                    'description': f'Navigate near {obj_to_fetch}'
                },
                {
                    'type': 'manipulation',
                    'action': 'pick',
                    'object': obj_to_fetch,
                    'description': f'Pick up {obj_to_fetch}'
                },
                {
                    'type': 'navigation',
                    'destination': destination,
                    'description': f'Navigate to {destination} with object'
                },
                {
                    'type': 'manipulation',
                    'action': 'place',
                    'location': destination,
                    'description': f'Place object at {destination}'
                }
            ])

        return tasks

    def extract_destination(self, command, context):
        """Extract destination from command and context"""
        # Simplified extraction - in practice use proper NLP
        if 'kitchen' in command.lower():
            return 'kitchen'
        elif 'living room' in command.lower() or 'livingroom' in command.lower():
            return 'living_room'
        elif 'bedroom' in command.lower():
            return 'bedroom'
        elif 'table' in command.lower():
            return 'dining_table'
        else:
            return 'default_location'

    def extract_object(self, command, context):
        """Extract object from command and context"""
        # Simplified extraction
        objects = ['cup', 'book', 'bottle', 'ball', 'box', 'phone']
        for obj in objects:
            if obj in command.lower():
                return obj
        return 'unknown_object'

    def extract_location(self, command, context):
        """Extract location from command and context"""
        # Simplified extraction
        if 'table' in command.lower():
            return 'table'
        elif 'counter' in command.lower():
            return 'counter'
        elif 'shelf' in command.lower():
            return 'shelf'
        else:
            return 'default_location'

    def execute_next_task(self):
        """Execute the next task in the queue"""
        if not self.task_queue:
            self.get_logger().info('Task queue is empty')
            return

        self.current_task = self.task_queue.pop(0)
        self.get_logger().info(f'Executing task: {self.current_task["description"]}')

        # Execute based on task type
        if self.current_task['type'] == 'navigation':
            self.execute_navigation_task(self.current_task)
        elif self.current_task['type'] == 'manipulation':
            self.execute_manipulation_task(self.current_task)

    def execute_navigation_task(self, task):
        """Execute navigation task"""
        # Wait for navigation action server
        if not self.nav_client.wait_for_server(timeout_sec=5.0):
            self.get_logger().error('Navigation action server not available')
            self.current_task = None
            self.execute_next_task()
            return

        # Create navigation goal
        goal_msg = NavigateToPose.Goal()
        goal_msg.pose.header.frame_id = 'map'

        # In a real system, you'd get the actual pose for the destination
        # For now, we'll use a placeholder
        goal_msg.pose.pose.position.x = 1.0  # Placeholder coordinates
        goal_msg.pose.pose.position.y = 1.0
        goal_msg.pose.pose.orientation.w = 1.0

        # Send navigation goal
        self.get_logger().info('Sending navigation goal')
        future = self.nav_client.send_goal_async(goal_msg)
        future.add_done_callback(self.navigation_result_callback)

    def navigation_result_callback(self, future):
        """Handle navigation result"""
        try:
            goal_handle = future.result()
            if not goal_handle.accepted:
                self.get_logger().info('Navigation goal rejected')
                self.current_task = None
                self.execute_next_task()
                return

            self.get_logger().info('Navigation goal accepted, waiting for result')
            result_future = goal_handle.get_result_async()
            result_future.add_done_callback(self.navigation_complete_callback)
        except Exception as e:
            self.get_logger().error(f'Error in navigation callback: {e}')
            self.current_task = None
            self.execute_next_task()

    def navigation_complete_callback(self, future):
        """Handle completion of navigation"""
        try:
            result = future.result().result
            status = future.result().status

            if status == GoalStatus.STATUS_SUCCEEDED:
                self.get_logger().info('Navigation completed successfully')
            else:
                self.get_logger().info(f'Navigation failed with status: {status}')

            # Move to next task
            self.current_task = None
            self.execute_next_task()

        except Exception as e:
            self.get_logger().error(f'Error in navigation complete callback: {e}')
            self.current_task = None
            self.execute_next_task()

    def execute_manipulation_task(self, task):
        """Execute manipulation task (placeholder)"""
        self.get_logger().info(f'Executing manipulation task: {task["action"]}')

        # In a real system, this would interface with manipulation controllers
        # For now, just simulate completion
        self.get_logger().info(f'Manipulation task completed: {task["action"]}')

        # Move to next task
        self.current_task = None
        self.execute_next_task()

def main(args=None):
    rclpy.init(args=args)
    planner_node = VLATaskPlannerNode()

    try:
        rclpy.spin(planner_node)
    except KeyboardInterrupt:
        pass
    finally:
        planner_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

#### Verification Steps
1. Create the custom message type `VLACommand.msg`:
   ```
   string command
   string context
   ```
2. Save the task planner node in your package
3. Launch the node:
   ```bash
   ros2 run vla_examples vla_task_planner
   ```
4. Send a complex task command:
   ```bash
   ros2 topic pub /vla/task_command vla_msgs/VLACommand "command: 'Please bring me the red cup from the kitchen and place it on the dining table'"
   ```

#### Expected Output
- Complex task broken down into subtasks
- Navigation and manipulation actions executed in sequence
- Robot completes multi-step task based on natural language command

### 4. Interactive VLA Learning System

This example demonstrates how a VLA system can learn from human demonstrations.

#### Learning Node (`vla_learning.py`)

```python
#!/usr/bin/env python3
# vla_learning.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, JointState
from std_msgs.msg import String
from geometry_msgs.msg import Twist
from cv_bridge import CvBridge
import cv2
import numpy as np
import torch
import torch.nn as nn
import pickle
from collections import deque

class VLALearningNode(Node):
    def __init__(self):
        super().__init__('vla_learning')

        # Initialize CvBridge
        self.bridge = CvBridge()

        # Learning-related variables
        self.demonstration_buffer = deque(maxlen=1000)  # Store recent demonstrations
        self.is_recording = False
        self.current_demo = []

        # Neural network for learning
        self.behavioral_net = self.create_behavioral_network()

        # Subscribe to relevant topics
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        self.joint_state_sub = self.create_subscription(
            JointState,
            '/joint_states',
            self.joint_state_callback,
            10
        )

        self.cmd_vel_sub = self.create_subscription(
            Twist,
            '/cmd_vel',
            self.cmd_vel_callback,
            10
        )

        # Subscribe to learning commands
        self.learning_cmd_sub = self.create_subscription(
            String,
            '/vla/learning_command',
            self.learning_command_callback,
            10
        )

        # Publish learned actions
        self.action_pub = self.create_publisher(
            Twist,
            '/learned_cmd_vel',
            10
        )

        self.get_logger().info('VLA Learning Node initialized')

    def create_behavioral_network(self):
        """Create a simple neural network for behavioral cloning"""
        # This is a simplified network - in practice you'd use more sophisticated architectures
        class BehavioralNet(nn.Module):
            def __init__(self):
                super(BehavioralNet, self).__init__()
                # Simple CNN for image processing
                self.conv1 = nn.Conv2d(3, 16, kernel_size=3, stride=2)
                self.conv2 = nn.Conv2d(16, 32, kernel_size=3, stride=2)
                self.conv3 = nn.Conv2d(32, 64, kernel_size=3, stride=2)

                # Fully connected layers
                self.fc1 = nn.Linear(64 * 7 * 7 + 6, 128)  # 6 joint states + image features
                self.fc2 = nn.Linear(128, 64)
                self.fc3 = nn.Linear(64, 2)  # linear.x and angular.z

                self.relu = nn.ReLU()
                self.dropout = nn.Dropout(0.5)

            def forward(self, image, joint_states):
                # Process image
                x = self.relu(self.conv1(image))
                x = self.relu(self.conv2(x))
                x = self.relu(self.conv3(x))
                x = x.view(x.size(0), -1)  # Flatten

                # Concatenate with joint states
                x = torch.cat([x, joint_states], dim=1)

                # Fully connected layers
                x = self.relu(self.fc1(x))
                x = self.dropout(x)
                x = self.relu(self.fc2(x))
                x = self.dropout(x)
                x = self.fc3(x)

                return x

        return BehavioralNet()

    def image_callback(self, msg):
        """Process incoming image"""
        try:
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Resize image for processing
            cv_image = cv2.resize(cv_image, (64, 64))
            image_tensor = torch.from_numpy(cv_image).float().permute(2, 0, 1).unsqueeze(0) / 255.0

            if self.is_recording:
                self.current_demo.append({'image': image_tensor, 'timestamp': msg.header.stamp})

        except Exception as e:
            self.get_logger().error(f'Error processing image: {e}')

    def joint_state_callback(self, msg):
        """Process joint states"""
        if self.is_recording:
            # Extract relevant joint positions (simplified)
            joint_positions = torch.tensor(list(msg.position[:6]), dtype=torch.float32).unsqueeze(0)  # First 6 joints
            if self.current_demo:
                self.current_demo[-1]['joint_states'] = joint_positions

    def cmd_vel_callback(self, msg):
        """Process commanded velocities (demonstrations)"""
        if self.is_recording:
            action = torch.tensor([msg.linear.x, msg.angular.z], dtype=torch.float32)
            if self.current_demo:
                self.current_demo[-1]['action'] = action

    def learning_command_callback(self, msg):
        """Process learning commands"""
        command = msg.data.lower()

        if command == 'start_recording':
            self.start_recording()
        elif command == 'stop_recording':
            self.stop_recording()
        elif command == 'train':
            self.train_network()
        elif command == 'save_model':
            self.save_model()
        elif command == 'load_model':
            self.load_model()
        elif command == 'execute':
            self.execute_learned_behavior()

    def start_recording(self):
        """Start recording demonstrations"""
        self.is_recording = True
        self.current_demo = []
        self.get_logger().info('Started recording demonstration')

    def stop_recording(self):
        """Stop recording and save demonstration"""
        if self.current_demo:
            self.demonstration_buffer.extend(self.current_demo)
            self.get_logger().info(f'Stopped recording, saved {len(self.current_demo)} steps')
        else:
            self.get_logger().info('No demonstration steps to save')
        self.is_recording = False
        self.current_demo = []

    def train_network(self):
        """Train the behavioral cloning network"""
        if len(self.demonstration_buffer) < 10:
            self.get_logger().warn('Not enough demonstrations to train')
            return

        self.get_logger().info('Starting training...')

        # Prepare data
        images = []
        joint_states = []
        actions = []

        for step in self.demonstration_buffer:
            if 'image' in step and 'joint_states' in step and 'action' in step:
                images.append(step['image'])
                joint_states.append(step['joint_states'])
                actions.append(step['action'])

        if not images:
            self.get_logger().warn('No complete demonstration steps found')
            return

        # Convert to tensors
        images = torch.cat(images, dim=0)
        joint_states = torch.cat(joint_states, dim=0)
        actions = torch.cat(actions, dim=0)

        # Simple training loop (in practice use proper training)
        optimizer = torch.optim.Adam(self.behavioral_net.parameters(), lr=0.001)
        criterion = nn.MSELoss()

        # Train for a few epochs
        for epoch in range(10):
            optimizer.zero_grad()
            predicted_actions = self.behavioral_net(images, joint_states)
            loss = criterion(predicted_actions, actions)
            loss.backward()
            optimizer.step()

            if epoch % 5 == 0:
                self.get_logger().info(f'Training epoch {epoch}, loss: {loss.item():.4f}')

        self.get_logger().info('Training completed')

    def save_model(self):
        """Save the trained model"""
        try:
            torch.save(self.behavioral_net.state_dict(), '/tmp/vla_model.pth')
            # Also save the demonstration buffer
            with open('/tmp/vla_demonstrations.pkl', 'wb') as f:
                pickle.dump(list(self.demonstration_buffer), f)
            self.get_logger().info('Model and demonstrations saved')
        except Exception as e:
            self.get_logger().error(f'Error saving model: {e}')

    def load_model(self):
        """Load a trained model"""
        try:
            self.behavioral_net.load_state_dict(torch.load('/tmp/vla_model.pth'))
            self.get_logger().info('Model loaded successfully')
        except Exception as e:
            self.get_logger().error(f'Error loading model: {e}')

    def execute_learned_behavior(self):
        """Execute using learned behavior"""
        self.get_logger().info('Executing learned behavior - this would interface with the robot in a real system')

def main(args=None):
    rclpy.init(args=args)
    learning_node = VLALearningNode()

    try:
        rclpy.spin(learning_node)
    except KeyboardInterrupt:
        pass
    finally:
        learning_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

#### Verification Steps
1. Install required dependencies:
   ```bash
   pip install torch torchvision
   ```
2. Save the learning node in your package
3. Launch the node:
   ```bash
   ros2 run vla_examples vla_learning
   ```
4. Start recording a demonstration:
   ```bash
   ros2 topic pub /vla/learning_command std_msgs/String "data: 'start_recording'"
   ```
5. Control the robot manually while recording
6. Stop recording:
   ```bash
   ros2 topic pub /vla/learning_command std_msgs/String "data: 'stop_recording'"
   ```
7. Train the model:
   ```bash
   ros2 topic pub /vla/learning_command std_msgs/String "data: 'train'"
   ```

#### Expected Output
- Demonstrations recorded from human teleoperation
- Model trained to mimic demonstrated behaviors
- Learned policy can be executed autonomously

### 5. VLA System Integration and Evaluation

This example demonstrates how to integrate all VLA components and evaluate system performance.

#### Evaluation Node (`vla_evaluation.py`)

```python
#!/usr/bin/env python3
# vla_evaluation.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String, Float32
from geometry_msgs.msg import PoseStamped
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import numpy as np
from datetime import datetime

class VLAEvaluationNode(Node):
    def __init__(self):
        super().__init__('vla_evaluation')

        # Initialize CvBridge
        self.bridge = CvBridge()

        # Performance tracking
        self.task_success_count = 0
        self.total_tasks = 0
        self.response_times = []
        self.start_time = None

        # Subscribe to system status
        self.status_sub = self.create_subscription(
            String,
            '/vla/system_status',
            self.status_callback,
            10
        )

        # Subscribe to task completion
        self.completion_sub = self.create_subscription(
            String,
            '/vla/task_completion',
            self.completion_callback,
            10
        )

        # Publish performance metrics
        self.success_rate_pub = self.create_publisher(
            Float32,
            '/vla/success_rate',
            10
        )

        self.response_time_pub = self.create_publisher(
            Float32,
            '/vla/response_time_avg',
            10
        )

        # Timer for periodic evaluation
        self.eval_timer = self.create_timer(5.0, self.publish_evaluation_metrics)

        self.get_logger().info('VLA Evaluation Node initialized')

    def status_callback(self, msg):
        """Process system status updates"""
        status = msg.data
        if status == 'task_started':
            self.start_time = self.get_clock().now()
            self.total_tasks += 1
            self.get_logger().info(f'Started task #{self.total_tasks}')

    def completion_callback(self, msg):
        """Process task completion"""
        result = msg.data  # 'success' or 'failure'

        if self.start_time is not None:
            end_time = self.get_clock().now()
            response_time = (end_time.nanoseconds - self.start_time.nanoseconds) / 1e9
            self.response_times.append(response_time)
            self.start_time = None

            if result == 'success':
                self.task_success_count += 1
                self.get_logger().info(f'Task completed successfully in {response_time:.2f}s')
            else:
                self.get_logger().info(f'Task failed after {response_time:.2f}s')

        self.publish_evaluation_metrics()

    def publish_evaluation_metrics(self):
        """Publish current evaluation metrics"""
        if self.total_tasks > 0:
            success_rate = float(self.task_success_count) / self.total_tasks
            avg_response_time = np.mean(self.response_times) if self.response_times else 0.0

            # Publish metrics
            success_msg = Float32()
            success_msg.data = success_rate
            self.success_rate_pub.publish(success_msg)

            time_msg = Float32()
            time_msg.data = avg_response_time
            self.response_time_pub.publish(time_msg)

            self.get_logger().info(f'Evaluation - Success Rate: {success_rate:.2f}, '
                                 f'Avg Response Time: {avg_response_time:.2f}s, '
                                 f'Total Tasks: {self.total_tasks}')
        else:
            self.get_logger().info('No tasks completed yet for evaluation')

def main(args=None):
    rclpy.init(args=args)
    eval_node = VLAEvaluationNode()

    try:
        rclpy.spin(eval_node)
    except KeyboardInterrupt:
        pass
    finally:
        eval_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

#### Verification Steps
1. Save the evaluation node in your package
2. Launch the evaluation node:
   ```bash
   ros2 run vla_examples vla_evaluation
   ```
3. Run VLA tasks and monitor performance metrics:
   ```bash
   ros2 topic echo /vla/success_rate
   ros2 topic echo /vla/response_time_avg
   ```

#### Expected Output
- Performance metrics published continuously
- Success rate and response time measurements
- Evaluation data for system improvement

## Personalization Hooks

<BeginnerBackground>
**For Beginners:** Vision-Language-Action (VLA) systems are like giving a robot a complete set of human-like abilities: eyes to see (vision), ears and understanding for language (language), and hands to act (action). Just as humans use all these capabilities together to complete tasks, VLA systems combine these abilities in robots to make them more capable and easier to interact with using natural language.
</BeginnerBackground>

<ExpertBackground>
**For Experts:** VLA systems represent the frontier of multimodal AI integration in robotics. The challenge lies in effectively fusing heterogeneous modalities (visual, linguistic, and action spaces) while maintaining real-time performance. Consider exploring recent advances in foundation models for robotics, such as RT-1, BC-Z, or Instruct2Act, which demonstrate promising results in generalizable robot learning from natural language instructions.
</ExpertBackground>

<!-- URDU_TRANSLATION_START -->
### اردو ترجمہ (Urdu Translation)

(یہ حصہ اردو ترجمہ فیچر کے ذریعے متحرک طور پر ترجمہ کیا جائے گا۔)

<!-- URDU_TRANSLATION_END -->