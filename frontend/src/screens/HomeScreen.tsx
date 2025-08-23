import React, { useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity,
  Alert,
  Animated
} from 'react-native';
import { 
  Title, 
  Card, 
  Text, 
  Surface 
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { users } from '../constants/mockData';

const { width, height } = Dimensions.get('window');

// Extended lessons data for scrollable roadmap
const extendedLessons: Lesson[] = [
  { id: 1, title: "Letter A", letter: "A", status: "completed", dinoEmoji: '🦕', week: 1 },
  { id: 2, title: "Letter B", letter: "B", status: "completed", dinoEmoji: '🦖', week: 1 },
  { id: 3, title: "Letter C", letter: "C", status: "current", dinoEmoji: '🦴', week: 1 },
  { id: 4, title: "Letter D", letter: "D", status: "locked", dinoEmoji: '🥚', week: 1 },
  { id: 5, title: "Letter E", letter: "E", status: "locked", dinoEmoji: '🥚', week: 1 },
  { id: 6, title: "Week 1 Boss", letter: "Boss", status: "locked", dinoEmoji: '👑', week: 1 },
  { id: 7, title: "Letter F", letter: "F", status: "locked", dinoEmoji: '🥚', week: 2 },
  { id: 8, title: "Letter G", letter: "G", status: "locked", dinoEmoji: '🥚', week: 2 },
  { id: 9, title: "Letter H", letter: "H", status: "locked", dinoEmoji: '🥚', week: 2 },
  { id: 10, title: "Letter I", letter: "I", status: "locked", dinoEmoji: '🥚', week: 2 },
  { id: 11, title: "Letter J", letter: "J", status: "locked", dinoEmoji: '🥚', week: 2 },
  { id: 12, title: "Week 2 Boss", letter: "Boss", status: "locked", dinoEmoji: '👑', week: 2 },
];

type LessonStatus = 'completed' | 'current' | 'locked';

interface Lesson {
  id: number;
  title: string;
  letter: string;
  status: LessonStatus;
  dinoEmoji: string;
  week: number;
}

interface HomeScreenProps {
  navigation?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const user = users[0];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for current lesson
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const startPronunciation = (lesson: Lesson) => {
    if (lesson.status === 'locked') {
      Alert.alert(
        '🔒 Practice Locked',
        'Complete the previous letters first to unlock this adventure!',
        [{ text: 'Got it! 🦖' }]
      );
      return;
    }

    Alert.alert(
      `${lesson.dinoEmoji} ${lesson.title} Adventure!`,
      `Ready to practice with your dino friend?`,
      [
        { text: 'Not Ready', style: 'cancel' },
        { 
          text: "Let's Go! 🚀", 
          onPress: () => {
            if (navigation) {
              // navigation.navigate('PronunciationPractice', { lesson });
            }
            console.log('Starting adventure for:', lesson.letter);
          }
        }
      ]
    );
  };

  const getStatusStyle = (status: LessonStatus) => {
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

  const getLessonPosition = (index: number): { offsetX: number } => {
    // Create a beautiful zigzag pattern
    const patterns = [
      { offsetX: 0 },                    // Center
      { offsetX: -width * 0.15 },        // Left
      { offsetX: width * 0.15 },         // Right
      { offsetX: -width * 0.1 },         // Slightly left
      { offsetX: width * 0.1 },          // Slightly right
      { offsetX: 0 },                    // Center (boss battle)
    ];
    
    return patterns[index % patterns.length];
  };

  const renderDottedPath = (index: number) => {
    if (index === extendedLessons.length - 1) return null;
    
    const currentPos = getLessonPosition(index);
    const nextPos = getLessonPosition(index + 1);
    
    const isGoingLeft = nextPos.offsetX < currentPos.offsetX;
    const isGoingRight = nextPos.offsetX > currentPos.offsetX;
    const isStraight = Math.abs(nextPos.offsetX - currentPos.offsetX) < 10;
    
    return (
      <View style={styles.pathContainer}>
        <View style={[
          styles.dottedPath,
          isStraight && styles.straightPath,
          isGoingLeft && styles.leftCurve,
          isGoingRight && styles.rightCurve,
        ]}>
          {/* Create dotted effect with small circles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={[
              styles.pathDot,
              { opacity: 0.3 + (i * 0.1) } // Fade effect
            ]} />
          ))}
        </View>
      </View>
    );
  };

  const renderLessonNode = (lesson: Lesson, index: number) => {
    const position = getLessonPosition(index);
    
    return (
      <Animated.View 
        key={lesson.id} 
        style={[
          styles.lessonContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { translateX: position.offsetX }
            ]
          }
        ]}
      >
        {/* Lesson Node */}
        <TouchableOpacity
          style={[
            styles.lessonNode, 
            getStatusStyle(lesson.status),
            lesson.status === 'current' && {
              transform: [{ scale: pulseAnim }]
            }
          ]}
          onPress={() => startPronunciation(lesson)}
          activeOpacity={lesson.status === 'locked' ? 1 : 0.6}
        >
          <Text style={styles.dinoEmoji}>{lesson.dinoEmoji}</Text>
          
          {lesson.status === 'current' && (
            <View style={styles.playButton}>
              <MaterialCommunityIcons name="play" size={16} color="white" />
            </View>
          )}
          
          {lesson.status === 'completed' && (
            <View style={styles.checkmark}>
              <MaterialCommunityIcons name="check-bold" size={14} color="white" />
            </View>
          )}
          
          {lesson.title.includes('Boss') && (
            <View style={styles.bossGlow} />
          )}
        </TouchableOpacity>
        
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonSubtitle}>
            {lesson.status === 'completed' ? '✨ Mastered!' : 
             lesson.status === 'current' ? '🎯 Ready to Learn' : 
             '🔒 Coming Soon'}
          </Text>
        </View>

        {/* Dotted Path to next lesson */}
        {renderDottedPath(index)}
      </Animated.View>
    );
  };

  const renderWeekHeader = (weekNum: number) => (
    <Animated.View 
      style={[
        styles.weekHeader,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Surface style={styles.weekBadge} elevation={4}>
        <MaterialCommunityIcons name="calendar-star" size={20} color="white" />
        <Text style={styles.weekText}>Week {weekNum}</Text>
      </Surface>
    </Animated.View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      bounces={true}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Card style={styles.header}>
          <Card.Content style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.mascot}
              onPress={() => Alert.alert('🦖', 'Rawr! Ready for an adventure?')}
            >
              <Text style={styles.mascotEmoji}>🦖</Text>
              <Text style={styles.mascotText}>DinoPhonics</Text>
            </TouchableOpacity>
            
            <View style={styles.stats}>
              <View style={styles.stat}>
                <MaterialCommunityIcons name="fire" size={26} color="#FF5722" />
                <Text style={styles.statNumber}>{user.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.stat}>
                <MaterialCommunityIcons name="lightning-bolt" size={26} color="#FFC107" />
                <Text style={styles.statNumber}>{user.score}</Text>
                <Text style={styles.statLabel}>Dino Energy</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Adventure Overview */}
        <Surface style={styles.adventureOverview} elevation={4}>
          <Text style={styles.adventureTitle}>🌟 Your Learning Journey 🌟</Text>
          <Text style={styles.adventureSubtitle}>
            Practice letters with your dino friends on this magical adventure!
          </Text>
        </Surface>
      </Animated.View>

      {/* Main Roadmap */}
      <View style={styles.roadmap}>
        {/* Week 1 Section */}
        {renderWeekHeader(1)}
        <View style={styles.weekSection}>
          {extendedLessons.slice(0, 6).map((lesson, index) => (
            <View key={lesson.id}>
              {renderLessonNode(lesson, index)}
            </View>
          ))}
        </View>
        
        {/* Week 2 Section */}
        {renderWeekHeader(2)}
        <View style={styles.weekSection}>
          {extendedLessons.slice(6, 12).map((lesson, index) => (
            <View key={lesson.id}>
              {renderLessonNode(lesson, index + 6)}
            </View>
          ))}
        </View>
        
        {/* Coming Soon Section */}
        <Animated.View 
          style={[
            styles.comingSoon,
            {
              opacity: fadeAnim,
              transform: [{ scale: fadeAnim }]
            }
          ]}
        >
          <Text style={styles.comingSoonEmoji}>🥚✨🦴✨🥚</Text>
          <Text style={styles.comingSoonTitle}>More Dino Adventures Ahead!</Text>
          <Text style={styles.comingSoonText}>
            Keep practicing to unlock amazing new worlds with your dino friends! 🌎
          </Text>
          <View style={styles.comingSoonBadges}>
            <Text style={styles.futureBadge}>🏔️ Mountain Quest</Text>
            <Text style={styles.futureBadge}>🌊 Ocean Adventure</Text>
            <Text style={styles.futureBadge}>🌋 Volcano Challenge</Text>
          </View>
        </Animated.View>
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
  scrollContent: {
    paddingBottom: 60,
  },
  header: {
    margin: width * 0.04,
    backgroundColor: '#6200EE',
    borderRadius: width * 0.06,
    elevation: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  mascot: {
    alignItems: 'center',
  },
  mascotEmoji: {
    fontSize: width * 0.13,
  },
  mascotText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.042,
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: width * 0.08,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: width * 0.055,
    fontWeight: 'bold',
    marginTop: 6,
  },
  statLabel: {
    color: '#E1BEE7',
    fontSize: width * 0.028,
    fontWeight: '500',
  },
  adventureOverview: {
    margin: width * 0.04,
    padding: width * 0.05,
    borderRadius: width * 0.05,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
  },
  adventureTitle: {
    fontSize: width * 0.048,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
    textAlign: 'center',
  },
  adventureSubtitle: {
    fontSize: width * 0.034,
    color: '#BF360C',
    textAlign: 'center',
    lineHeight: 20,
  },
  roadmap: {
    paddingTop: 20,
    alignItems: 'center',
  },
  weekHeader: {
    alignItems: 'center',
    marginVertical: 25,
  },
  weekBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weekText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  weekSection: {
    width: '100%',
    paddingHorizontal: width * 0.05,
  },
  lessonContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  lessonNode: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: width * 0.11,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    position: 'relative',
  },
  completed: {
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#2E7D32',
  },
  current: {
    backgroundColor: '#FF9800',
    borderWidth: 4,
    borderColor: '#FF5722',
  },
  locked: {
    backgroundColor: '#BDBDBD',
    opacity: 0.7,
    borderWidth: 2,
    borderColor: '#9E9E9E',
  },
  dinoEmoji: {
    fontSize: width * 0.09,
  },
  playButton: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: '#FF5722',
    borderRadius: 18,
    padding: 8,
    elevation: 6,
  },
  checkmark: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    padding: 6,
    elevation: 6,
  },
  bossGlow: {
    position: 'absolute',
    width: width * 0.26,
    height: width * 0.26,
    borderRadius: width * 0.13,
    backgroundColor: '#FFD700',
    opacity: 0.3,
    zIndex: -1,
  },
  lessonInfo: {
    alignItems: 'center',
    marginTop: 15,
    maxWidth: width * 0.35,
  },
  lessonTitle: {
    fontSize: width * 0.038,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 4,
  },
  lessonSubtitle: {
    fontSize: width * 0.03,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  pathContainer: {
    position: 'absolute',
    bottom: -35,
    alignItems: 'center',
    width: width * 0.3,
  },
  dottedPath: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  straightPath: {
    alignItems: 'center',
  },
  leftCurve: {
    transform: [{ rotate: '-20deg' }],
    marginLeft: -20,
  },
  rightCurve: {
    transform: [{ rotate: '20deg' }],
    marginRight: -20,
  },
  pathDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#66BB6A',
    marginVertical: 2,
  },
  comingSoon: {
    alignItems: 'center',
    marginTop: 50,
    padding: width * 0.08,
    backgroundColor: '#F3E5F5',
    borderRadius: width * 0.06,
    elevation: 4,
    marginHorizontal: width * 0.04,
  },
  comingSoonEmoji: {
    fontSize: width * 0.12,
    marginBottom: 15,
    letterSpacing: 5,
  },
  comingSoonTitle: {
    fontSize: width * 0.048,
    fontWeight: 'bold',
    color: '#6200EE',
    textAlign: 'center',
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: width * 0.035,
    color: '#7B1FA2',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  comingSoonBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  futureBadge: {
    backgroundColor: '#E1BEE7',
    color: '#4A148C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: width * 0.028,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 40,
  },
});

export default HomeScreen;