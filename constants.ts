import React from 'react';
import { 
    ShieldCheckIcon, 
    ServerIcon, 
    ScaleIcon, 
    ChartBarIcon,
    ServerStackIcon,
    DocumentMagnifyingGlassIcon,
    CpuChipIcon,
    CircleStackIcon,
    UserGroupIcon,
    ArrowsRightLeftIcon,
    HeartIcon
} from './components/Icons.js';

export const TUNING_STEPS_DATA = [
    {
        id: 'increase-partitions',
        title: 'Step 1: Increase Partitions',
        description: 'Scale from 3 to 6 partitions for better parallelism.',
        emoji: '📊',
        content: {
            commandBuilder: {
                fields: [
                    { id: 'bootstrapServer', label: 'Bootstrap Server', defaultValue: 'kafka-broker-ip:9092' },
                    { id: 'topic', label: 'Topic Name', defaultValue: 'topic01' },
                    { id: 'partitions', label: 'New Partition Count', defaultValue: '6', type: 'number' },
                ],
                template: (params) => `kafka-topics.sh --bootstrap-server ${params.bootstrapServer} --alter --topic ${params.topic} --partitions ${params.partitions}`,
            },
            failureCases: [
                {
                    error: 'TOPIC_DOES_NOT_EXIST',
                    cause: 'The topic you are trying to alter does not exist.',
                    resolution: 'Ensure the topic name is correct. Use the "List Topics" command to verify.',
                },
                {
                    error: 'INVALID_PARTITIONS',
                    cause: 'You can only increase the number of partitions, not decrease them.',
                    resolution: 'Choose a partition count that is greater than the current number.',
                },
            ],
        },
    },
    {
        id: 'reassign-replicas',
        title: 'Step 2: Reassign Replicas',
        description: 'Generate and execute a plan to rebalance replicas across brokers.',
        emoji: '🔄',
        content: {
            commandBuilder: {
                fields: [
                    { id: 'bootstrapServer', label: 'Bootstrap Server', defaultValue: 'kafka-broker-ip:9092' },
                    { id: 'jsonFile', label: 'Reassignment JSON File Path', defaultValue: '/path/to/reassignment.json' },
                ],
                template: (params) => `kafka-reassign-partitions.sh --bootstrap-server ${params.bootstrapServer} --reassignment-json-file ${params.jsonFile} --execute`,
            },
            failureCases: [
                {
                    error: 'INVALID_REPLICA_ASSIGNMENT',
                    cause: 'The JSON file contains non-existent broker IDs or topic partitions.',
                    resolution: 'Verify that all broker IDs and topic-partition pairs in your JSON file are valid.',
                },
                {
                    error: 'REASSIGNMENT_IN_PROGRESS',
                    cause: 'Another reassignment is already running on the cluster.',
                    resolution: 'Wait for the current reassignment to complete or cancel it before starting a new one.',
                },
            ],
        },
    },
    {
        id: 'verify-reassignment',
        title: 'Step 3: Verify Reassignment',
        description: 'Confirm that the partition reassignment has completed successfully.',
        emoji: '✅',
        content: {
            commandBuilder: {
                fields: [
                    { id: 'bootstrapServer', label: 'Bootstrap Server', defaultValue: 'kafka-broker-ip:9092' },
                    { id: 'jsonFile', label: 'Reassignment JSON File Path', defaultValue: '/path/to/reassignment.json' },
                ],
                template: (params) => `kafka-reassign-partitions.sh --bootstrap-server ${params.bootstrapServer} --reassignment-json-file ${params.jsonFile} --verify`,
            },
            failureCases: [
                {
                    error: 'REASSIGNMENT_FAILED',
                    cause: 'The output shows that some replicas are still moving or not in sync.',
                    resolution: 'The process can take time. Run the --verify command again after a few minutes. If it persists, check broker logs for issues like disk space or network problems.',
                },
            ],
        },
    },
    {
        id: 'set-retention',
        title: 'Step 4: Set Retention Period',
        description: 'Configure a 48-hour data retention policy for the topic.',
        emoji: '⏱️',
        content: {
            commandBuilder: {
                fields: [
                    { id: 'bootstrapServer', label: 'Bootstrap Server', defaultValue: 'kafka-broker-ip:9092' },
                    { id: 'topic', label: 'Topic Name', defaultValue: 'topic01' },
                    { id: 'retentionMs', label: 'Retention (ms)', defaultValue: '172800000' },
                ],
                template: (params) => `kafka-configs.sh --bootstrap-server ${params.bootstrapServer} --entity-type topics --entity-name ${params.topic} --alter --add-config retention.ms=${params.retentionMs}`,
            },
            failureCases: [
                {
                    error: 'INVALID_CONFIG',
                    cause: 'The configuration key `retention.ms` is misspelled or the value is invalid.',
                    resolution: 'Ensure the config key is correct and the value is a valid long integer.',
                },
            ],
        },
    },
    {
        id: 'final-verification',
        title: 'Step 5: Final Verification',
        description: 'Describe the topic to validate all configuration changes are applied.',
        emoji: '🎯',
        content: {
            commandBuilder: {
                fields: [
                    { id: 'bootstrapServer', label: 'Bootstrap Server', defaultValue: 'kafka-broker-ip:9092' },
                    { id: 'topicName', label: 'Topic Name', defaultValue: 'topic01' },
                ],
                template: (params) => `kafka-topics.sh --bootstrap-server ${params.bootstrapServer} --describe --topic ${params.topicName}`,
            },
            failureCases: [
                {
                    error: 'UNKNOWN_TOPIC_OR_PARTITION',
                    cause: 'The specified topic does not exist.',
                    resolution: 'Verify the topic name is correct and has been created.',
                },
            ],
        },
    },
];

export const COMMON_OPERATIONS_DATA = [
    {
        id: 'check-broker-status',
        title: 'Check Broker Status',
        description: 'Ensure all brokers are up and part of the cluster.',
        emoji: React.createElement(ServerStackIcon, {className: 'w-4 h-4'}),
        content: {
            commandBuilder: {
                fields: [
                    { id: 'bootstrapServer', label: 'Bootstrap Server', defaultValue: 'localhost:9092' },
                ],
                template: (params) => `kafka-topics.sh --bootstrap-server ${params.bootstrapServer} --list`,
            },
            failureCases: [
                { error: 'Connection refused', cause: 'The bootstrap server is down or unreachable.', resolution: 'Verify the broker IP/port and ensure the Kafka process is running on the target machine.' },
            ],
        },
    },
    {
        id: 'monitor-partitions',
        title: 'Monitor Partitions',
        description: 'Verify no under-replicated or offline partitions.',
        emoji: React.createElement(DocumentMagnifyingGlassIcon, {className: 'w-4 h-4'}),
        content: {
            commandBuilder: {
                fields: [
                    { id: 'bootstrapServer', label: 'Bootstrap Server', defaultValue: 'localhost:9092' },
                    { id: 'topicName', label: 'Topic Name', defaultValue: 'my-topic' },
                ],
                template: (params) => `kafka-topics.sh --bootstrap-server ${params.bootstrapServer} --describe --topic ${params.topicName} --unavailable-partitions`,
            },
            failureCases: [
                { error: 'Output shows partitions', cause: 'One or more partitions have no leader and are offline.', resolution: 'This is critical. Check the logs of the brokers that were supposed to be leaders for these partitions. It could be a network issue or broker crash.' },
            ],
        },
    },
    {
        id: 'check-controller',
        title: 'Check Controller Node',
        description: 'Find which broker is the active controller.',
        emoji: React.createElement(CpuChipIcon, {className: 'w-4 h-4'}),
        content: {
            commandBuilder: {
                fields: [
                    { id: 'zookeeper', label: 'ZooKeeper Host', defaultValue: 'zookeeper-host:2181' },
                ],
                template: (params) => `zookeeper-shell.sh ${params.zookeeper} get /controller`,
            },
            failureCases: [
                { error: 'Node does not exist', cause: 'The /controller znode is missing, which means no controller is elected.', resolution: 'This indicates a major cluster issue. Check the health and connectivity of all brokers and ZooKeeper nodes.' },
            ],
        },
    },
    {
        id: 'monitor-disk-usage',
        title: 'Monitor Disk Usage',
        description: 'Ensure broker disks are not nearing full capacity.',
        emoji: React.createElement(CircleStackIcon, {className: 'w-4 h-4'}),
        content: {
            commandBuilder: {
                fields: [],
                template: () => `# On each broker, run this standard Linux command:\ndf -h /path/to/kafka-logs`,
            },
            failureCases: [
                { error: 'High disk usage (e.g., >85%)', cause: 'Log retention policies are too long, or data ingestion rate is higher than planned.', resolution: 'Decrease retention periods for non-critical topics. Add more disk space or add more brokers to the cluster.' },
            ],
        },
    },
    {
        id: 'track-consumer-lag',
        title: 'Track Consumer Lag',
        description: 'Ensure consumer groups are keeping up with producers.',
        emoji: React.createElement(UserGroupIcon, {className: 'w-4 h-4'}),
        content: {
            commandBuilder: {
                fields: [
                    { id: 'bootstrapServer', label: 'Bootstrap Server', defaultValue: 'localhost:9092' },
                    { id: 'group', label: 'Consumer Group Name', defaultValue: 'my-consumer-group' },
                ],
                template: (params) => `kafka-consumer-groups.sh --bootstrap-server ${params.bootstrapServer} --describe --group ${params.group}`,
            },
            failureCases: [
                { error: 'High LAG values', cause: 'Consumers are processing messages slower than they are being produced.', resolution: 'Scale out consumers by adding more instances within the same group. Ensure consumers are not crashing or stuck.' },
            ],
        },
    },
    {
        id: 'check-isr-changes',
        title: 'Check for ISR Changes',
        description: 'Detect if replicas are frequently falling out of sync.',
        emoji: React.createElement(ArrowsRightLeftIcon, {className: 'w-4 h-4'}),
        content: {
            commandBuilder: {
                fields: [],
                template: () => `# This is not a CLI command. Monitor the JMX metric on each broker:\n# kafka.server:type=ReplicaManager,name=IsrShrinksPerSec`,
            },
            failureCases: [
                { error: 'High rate of ISR shrinks', cause: 'Replicas cannot keep up with the leader due to network latency, overloaded disks, or broker GC pauses.', resolution: 'Investigate broker performance on the affected nodes. Check network between brokers. Optimize producer batch sizes.' },
            ],
        },
    },
    {
        id: 'zookeeper-health',
        title: 'Check ZooKeeper/KRaft Health',
        description: 'Ensure the coordination service is stable.',
        emoji: React.createElement(HeartIcon, {className: 'w-4 h-4'}),
        content: {
            commandBuilder: {
                fields: [
                    { id: 'zookeeper', label: 'ZooKeeper Host', defaultValue: 'zookeeper-host:2181' },
                ],
                template: (params) => `# For ZooKeeper, use the 'ruok' (are you okay) four-letter word command:\necho ruok | nc ${params.zookeeper}`,
            },
            failureCases: [
                { error: 'Does not return "imok"', cause: 'The ZooKeeper node is down, overloaded, or not responding.', resolution: 'Check the ZooKeeper process and its logs on the specified host. Ensure there are no network firewalls blocking the port.' },
            ],
        },
    },
];

export const BEST_PRACTICES_DATA = [
    {
        category: 'Replication & Availability',
        icon: React.createElement(ShieldCheckIcon, { className: "w-6 h-6" }),
        points: [
            'Use a replication factor of at least 3 for all production topics.',
            'Enable unclean leader election only as a last resort for availability.',
            'Distribute replicas across different racks or availability zones.',
            'Monitor under-replicated partitions and ISR shrink/expand rates.',
        ],
        color: 'indigo',
    },
    {
        category: 'Broker Configuration',
        icon: React.createElement(ServerIcon, { className: "w-6 h-6" }),
        points: [
            'Separate Zookeeper and Kafka brokers onto different machines.',
            'Use dedicated disks for Kafka logs to avoid I/O contention.',
            'Tune `num.network.threads` and `num.io.threads` based on core count.',
            'Set JVM heap size appropriately, typically 6-8 GB, and avoid swapping.',
        ],
        color: 'purple',
    },
    {
        category: 'Producers & Consumers',
        icon: React.createElement(ScaleIcon, { className: "w-6 h-6" }),
        points: [
            'Tune producer `batch.size` and `linger.ms` to balance latency and throughput.',
            'Enable idempotent producers to avoid message duplication.',
            'Ensure consumer `session.timeout.ms` is higher than `max.poll.interval.ms`.',
            'Commit offsets regularly but not too frequently to avoid overhead.',
        ],
        color: 'pink',
    },
    {
        category: 'Monitoring & Alerting',
        icon: React.createElement(ChartBarIcon, { className: "w-6 h-6" }),
        points: [
            'Monitor key broker metrics: UnderReplicatedPartitions, ActiveControllerCount.',
            'Track producer/consumer metrics: request latency, batch size, record-send-rate.',
            'Set up alerts for high disk usage, CPU load, and network I/O.',
            'Use tools like Prometheus with JMX Exporter for comprehensive monitoring.',
        ],
        color: 'green',
    },
];