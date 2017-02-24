## Blue Green Deployer

### Pattern: swap Auto Scaling Groups Deployment process
- Amazon Elastic Load Balancer (ELB) outside the environment boundary
- Start with current Auto Scaling Group (ASG)
- Deploy & scale out new ASG
- Test green stack
- Register green ASG with ELB
- Remove blue ASG from ELB

### Swapping Auto Scaling groups behind ELB
- Register with ELB
- One or more EC2 instances
- One or more Auto Scaling groups
- Least outstanding requests algorithm favors green ASG instances for new connections
- Connection draining - gracefully stop receiving traffic
- Scale out green ASG before ELB registration
- Put blue instances in standby

```bash
$ aws autoscaling attach-load-balancers --auto-scaling-group-name "green-asg" --load-balancer-names "my-app-elb"
$ aws autoscaling set-desired-capacity --auto-scaling-group-name "green-asg" --desired-capacity X
$ aws autoscaling detach-load-balancers --auto-scaling-group-name "blue-asg" --load-balancer-names "my-app-elb"
$ aws autoscaling enter-standby --instance-ids i-xxxxxxxx --auto-scaling-group-name "blue-asg" --should-decrement-desired-capacity
```

### Pattern review: Swap Auto Scaling groups
| Risk category           | Mitigation Level  |  Reasoning                                                   |
|-------------------------|-------------------|--------------------------------------------------------------|
| Application issues      | Great             |  Facilitates canary analysis w/ additional ELB               |
| Application performance | Good              |  Traffic split management, but less granular, pre-warmed ELB |
| People/process errors   | Good              |  Depends on automation framework                             |
| Infrastructure failure  | Great             |  Auto-scaling                                                |
| Rollback                | Great             |  No DNS complexities                                         |
| Cost                    | Great             |  Optimized via auto-scaling                                  |
