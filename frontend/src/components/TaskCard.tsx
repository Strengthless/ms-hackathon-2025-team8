import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Badge } from 'react-native-paper';
import { Status, AssignmentDetail } from "../constants/mockData";

interface TaskCardProps {
  task: AssignmentDetail;
  onClick: () => void;
}

const TaskCard = ({ task, onClick } : TaskCardProps) => {
  const getStatusColor = (status : Status) => {
    switch (status) {
      case Status.Completed:
        return '#4CAF50';
      case Status.InProgress:
        return '#FF9800';
      case Status.NotStarted:
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status : Status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card style={styles.card} onPress={onClick}>
      <Card.Content>
        <View style={styles.header}>
          <Title>{task.title}</Title>
          <Badge
            style={[
              styles.badge,
              { backgroundColor: getStatusColor(task.status) },
            ]}
          >
            {getStatusText(task.status)}
          </Badge>
        </View>
        <Paragraph>Due: {task.dueDate}</Paragraph>
        <Paragraph>Points: {task.points}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    cursor: 'pointer',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
  },
});

export default TaskCard;
