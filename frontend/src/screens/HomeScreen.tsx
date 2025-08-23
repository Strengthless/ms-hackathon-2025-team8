import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { 
  Title, 
  Card, 
  Text, 
  Surface 
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { users, weeklyLessons } from '../constants/mockData';

const { width } = Dimensions.get('window');

interface Lesson {
  id: number;
  title: string;
  letter: string;
  status: 'completed' | 'current' | 'locked';
  week: number;
  dinoEmoji: string;
  pronunciationTips: string[];
  points: number;
}

interface HomeScreenProps {
  navigation?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const user = users[0];

  const startPronunciation = (lesson: Lesson) => {
    if (lesson.status === 'locked') {
      Alert.alert(
        '🔒 Practice Locked',
        'Complete the previous letter first!',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      `🦖 ${lesson.title} Practice`,
      `Ready to practice pronouncing "${lesson.letter}" with your dino friend?`,
      [
        { text: 'Not Ready', style: 'cancel' },
        { 
          text: 'Start Practice!', 
          onPress: () => {
            // Navigate to pronunciation practice
            if (navigation) {
              // navigation.navigate('PronunciationPractice', { lesson });
            }
            console.log('Starting pronunciation for:', lesson.letter);
          }
        }
      ]
    );
  };

  const getStatusStyle = (status: Lesson['status']) => {
    switch (status) {
      case 'completed':
        return styles.completed;
      case 'current':
        return styles.current;
      case 'locked':
        return styles.locked;
      default:
        return styles.locked;
    }
  };

  const renderLessonNode = (lesson: Lesson, index: number) => {
    const isEven = index % 2 === 0;
    
    return (
      <View key={lesson.id} style={styles.lessonRow}>
        {index > 0 && <View style={styles.connector} />}
        
        <View style={[styles.lessonWrapper, isEven ? styles.leftSide : styles.rightSide]}>
          <TouchableOpacity
            style={[styles.lessonNode, getStatusStyle(lesson.status)]}
            onPress={() => startPronunciation(lesson)}
            activeOpacity={lesson.status === 'locked' ? 1 : 0.7}
          >
            <Text style={styles.dinoEmoji}>{lesson.dinoEmoji}</Text>
            
            {lesson.status === 'current' && (
              <View style={styles.playButton}>
                <MaterialCommunityIcons name="play" size={18} color="white" />
              </View>
            )}
            
            {lesson.status === 'completed' && (
              <View style={styles.checkmark}>
                <MaterialCommunityIcons name="check" size={16} color="white" />
              </View>
            )}
          </TouchableOpacity>
          
          <View style={[styles.lessonInfo, isEven ? styles.infoRight : styles.infoLeft]}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonSubtitle}>Pronunciation Practice</Text>
          </View>
        </View>
      </View>
    );
  };

  // Type assertion to ensure compatibility
  const typedWeeklyLessons = weeklyLessons as Lesson[];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Card style={styles.header}>
        <Card.Content style={styles.headerContent}>
          <View style={styles.mascot}>
            <Text style={styles.mascotEmoji}>🦖</Text>
            <Text style={styles.mascotText}>DinoPhonics</Text>
          </View>
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <MaterialCommunityIcons name="fire" size={24} color="#FF5722" />
              <Text style={styles.statNumber}>{user.streak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.stat}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FFC107" />
              <Text style={styles.statNumber}>{user.score}</Text>
              <Text style={styles.statLabel}>Energy</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Surface style={styles.weekProgress}>
        <Text style={styles.weekTitle}>Week 1 - Letter Sounds</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '40%' }]} />
        </View>
        <Text style={styles.progressText}>2 of 5 letters completed</Text>
      </Surface>

      <View style={styles.roadmap}>
        <Title style={styles.roadmapTitle}>Your Pronunciation Journey</Title>
        
        {typedWeeklyLessons.map((lesson, index) => renderLessonNode(lesson, index))}

        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonEmoji}>🥚</Text>
          <Text style={styles.comingSoonText}>Next week's letters coming soon!</Text>
        </View>
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    margin: width * 0.05,
    backgroundColor: '#6200EE',
    borderRadius: width * 0.05,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mascot: {
    alignItems: 'center',
  },
  mascotEmoji: {
    fontSize: width * 0.12,
  },
  mascotText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  stats: {
    flexDirection: 'row',
    gap: width * 0.06,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    color: '#E1BEE7',
    fontSize: width * 0.03,
  },
  weekProgress: {
    margin: width * 0.05,
    padding: width * 0.05,
    borderRadius: width * 0.04,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
  },
  weekTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#FFCC80',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9800',
  },
  progressText: {
    fontSize: width * 0.03,
    color: '#BF360C',
  },
  roadmapTitle: {
    textAlign: 'center',
    fontSize: width * 0.05,
    color: '#2E7D32',
    marginBottom: width * 0.05,
  },
  roadmap: {
    paddingHorizontal: width * 0.05,
    paddingBottom: width * 0.1,
  },
  lessonRow: {
    position: 'relative',
    marginBottom: width * 0.08,
  },
  connector: {
    position: 'absolute',
    top: -width * 0.04,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: width * 0.04,
    backgroundColor: '#A5D6A7',
    borderRadius: 2,
  },
  lessonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSide: {
    justifyContent: 'flex-start',
  },
  rightSide: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  lessonNode: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.09,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    position: 'relative',
  },
  completed: {
    backgroundColor: '#4CAF50',
  },
  current: {
    backgroundColor: '#FF9800',
    borderWidth: 3,
    borderColor: '#FFE0B2',
    transform: [{ scale: 1.1 }],
  },
  locked: {
    backgroundColor: '#9E9E9E',
    opacity: 0.7,
  },
  dinoEmoji: {
    fontSize: width * 0.08,
  },
  playButton: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 4,
  },
  checkmark: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 3,
  },
  lessonInfo: {
    maxWidth: width * 0.25,
  },
  infoRight: {
    marginLeft: width * 0.04,
    alignItems: 'flex-start',
  },
  infoLeft: {
    marginRight: width * 0.04,
    alignItems: 'flex-end',
  },
  lessonTitle: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  lessonSubtitle: {
    fontSize: width * 0.028,
    color: '#757575',
    textAlign: 'center',
    marginTop: 2,
  },
  comingSoon: {
    alignItems: 'center',
    marginTop: width * 0.1,
    padding: width * 0.06,
    backgroundColor: '#F3E5F5',
    borderRadius: width * 0.04,
  },
  comingSoonEmoji: {
    fontSize: width * 0.08,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: width * 0.035,
    color: '#6200EE',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomSpace: {
    height: width * 0.05,
  },
});

export default HomeScreen;