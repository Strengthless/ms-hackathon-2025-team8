import React, { useRef, useEffect, useState } from 'react';
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
  const titleGlow = useRef(new Animated.Value(0)).current;
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);

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

    // Title glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(titleGlow, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const startPronunciation = (lesson: Lesson) => {
    if (lesson.status === 'locked') {
      Alert.alert(
        'Adventure Locked',
        'Complete the previous lessons to unlock this adventure!',
        [{ text: 'Got it!' }]
      );
      return;
    }

    Alert.alert(
      `${lesson.title} Adventure`,
      `Ready to start your pronunciation practice?`,
      [
        { text: 'Not Ready', style: 'cancel' },
        { 
          text: "Let's Go!", 
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

  const getStatusStyle = (status: LessonStatus, isHovered: boolean = false) => {
    let baseStyle;
    
    switch (status) {
      case 'completed':
        baseStyle = styles.completed;
        break;
      case 'current':
        baseStyle = styles.current;
        break;
      case 'locked':
        baseStyle = styles.locked;
        break;
      default:
        baseStyle = styles.locked;
    }

    return [
      baseStyle,
      isHovered && status !== 'locked' && styles.hovered
    ];
  };

  const getLessonPosition = (index: number): { offsetX: number } => {
    // Create a smoother zigzag pattern
    const centerX = 0;
    const leftOffset = -width * 0.12;
    const rightOffset = width * 0.12;
    
    const patterns = [
      { offsetX: centerX },           // Center - A
      { offsetX: leftOffset },        // Left - B  
      { offsetX: rightOffset },       // Right - C
      { offsetX: leftOffset * 0.7 },  // Slightly left - D
      { offsetX: rightOffset * 0.7 }, // Slightly right - E
      { offsetX: centerX },           // Center - Boss
    ];
    
    return patterns[index % patterns.length];
  };

  const renderLessonNode = (lesson: Lesson, index: number) => {
    const position = getLessonPosition(index);
    const isHovered = hoveredLesson === lesson.id;
    
    // Create staggered entrance animation
    const delayedFade = useRef(new Animated.Value(0)).current;
    const bounceIn = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      const delay = index * 200; // Stagger each lesson
      
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(delayedFade, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(bounceIn, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
        ])
      ]).start();
    }, [delayedFade, bounceIn, index]);
    
    return (
      <Animated.View 
        key={lesson.id} 
        style={[
          styles.lessonContainer,
          {
            opacity: Animated.multiply(fadeAnim, delayedFade),
            transform: [
              { translateY: slideAnim },
              { translateX: position.offsetX },
              { 
                scale: bounceIn.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1]
                })
              }
            ]
          }
        ]}
      >
        {/* Lesson Node */}
        <TouchableOpacity
          style={[
            styles.lessonNode,
            ...getStatusStyle(lesson.status, isHovered),
            lesson.status === 'current' && {
              transform: [{ scale: pulseAnim }]
            },
            isHovered && { transform: [{ scale: 1.05 }] }
          ]}
          onPress={() => startPronunciation(lesson)}
          onPressIn={() => setHoveredLesson(lesson.id)}
          onPressOut={() => setHoveredLesson(null)}
          activeOpacity={lesson.status === 'locked' ? 1 : 0.6}
        >
          <Text style={styles.dinoEmoji}>{lesson.dinoEmoji}</Text>
          
          {lesson.status === 'current' && (
            <Animated.View style={styles.playButton}>
              <MaterialCommunityIcons name="play" size={16} color="white" />
            </Animated.View>
          )}
          
          {lesson.status === 'completed' && (
            <View style={styles.checkmark}>
              <MaterialCommunityIcons name="check-bold" size={14} color="white" />
            </View>
          )}
          
          {lesson.title.includes('Boss') && (
            <View style={styles.bossGlow} />
          )}
          
          {/* Hover sparkle effect */}
          {isHovered && lesson.status !== 'locked' && (
            <View style={styles.hoverSparkles}>
              <Text style={styles.sparkle}>✨</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.lessonInfo}>
          <Text style={[
            styles.lessonTitle,
            isHovered && lesson.status !== 'locked' && styles.titleHovered
          ]}>
            {lesson.title}
          </Text>
          <Text style={styles.lessonSubtitle}>
            {lesson.status === 'completed' ? 'Mastered!' : 
             lesson.status === 'current' ? 'Ready to Learn' : 
             'Coming Soon'}
          </Text>
        </View>

        {/* Connecting Path to next lesson */}
      </Animated.View>
    );
  };

  const renderWeekHeader = (weekNum: number) => {
    const weekFade = useRef(new Animated.Value(0)).current;
    const weekSlide = useRef(new Animated.Value(-50)).current;
    
    useEffect(() => {
      const weekDelay = weekNum * 300;
      
      Animated.sequence([
        Animated.delay(weekDelay),
        Animated.parallel([
          Animated.timing(weekFade, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(weekSlide, {
            toValue: 0,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
          }),
        ])
      ]).start();
    }, [weekFade, weekSlide, weekNum]);
    
    return (
      <Animated.View 
        style={[
          styles.weekHeader,
          {
            opacity: Animated.multiply(fadeAnim, weekFade),
            transform: [
              { translateY: weekSlide },
              { 
                scale: weekFade.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }
            ]
          }
        ]}
      >
        <Surface style={styles.weekBadge} elevation={4}>
          <MaterialCommunityIcons name="calendar-star" size={20} color="white" />
          <Text style={styles.weekText}>Week {weekNum}</Text>
        </Surface>
      </Animated.View>
    );
  };

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
              onPress={() => Alert.alert('DinoPhonics', 'Ready for an adventure?')}
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
        <View style={styles.adventureOverview}>
          <Text style={styles.adventureTitle}>Your Learning Journey</Text>
        </View>
      </Animated.View>

      {/* Main Roadmap */}
      <View style={styles.roadmap}>
        {/* Floating particles animation */}
        <View style={styles.floatingParticles}>
          <Animated.View 
            style={[
              styles.particle,
              {
                transform: [
                  {
                    translateY: titleGlow.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10]
                    })
                  }
                ]
              }
            ]}
          >
            <Text style={styles.particleText}>✨</Text>
          </Animated.View>
          <Animated.View 
            style={[
              styles.particle,
              styles.particle2,
              {
                transform: [
                  {
                    translateY: titleGlow.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -8]
                    })
                  }
                ]
              }
            ]}
          >
            <Text style={styles.particleText}>💫</Text>
          </Animated.View>
        </View>
        
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
          <Text style={styles.comingSoonTitle}>More Adventures Ahead!</Text>
          <Text style={styles.comingSoonText}>
            Keep practicing to unlock new worlds with your dino friends!
          </Text>
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
    marginTop: width * 0.01,
    marginBottom: width * 0.02, // Reduced space before Week 1
    alignItems: 'center',
  },
  adventureTitle: {
    fontSize: width * 0.06,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  roadmap: {
    paddingTop: 20,
    alignItems: 'center',
    position: 'relative',
  },
  floatingParticles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: -1,
  },
  particle: {
    position: 'absolute',
    top: 20,
    left: width * 0.2,
  },
  particle2: {
    position: 'absolute',
    top: 10,
    left: width * 0.7,
  },
  particleText: {
    fontSize: 20,
    opacity: 0.6,
  },
  weekHeader: {
    alignItems: 'center',
    marginVertical: 15, // Reduced vertical spacing
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
    marginVertical: 25, // Increased spacing for better path visibility
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
    opacity: 1,
    borderWidth: 3,
    borderColor: '#2E7D32',
  },
  current: {
    backgroundColor: '#FF9800',
    opacity: 1,
    borderWidth: 4,
    borderColor: '#FF5722',
  },
  locked: {
    backgroundColor: '#BDBDBD',
    opacity: 0.7,
    borderWidth: 2,
    borderColor: '#9E9E9E',
  },
  hovered: {
    elevation: 15,
    shadowOpacity: 0.4,
    shadowRadius: 15,
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
  hoverSparkles: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  sparkle: {
    fontSize: 16,
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
  titleHovered: {
    color: '#1B5E20',
    fontSize: width * 0.04,
  },
  lessonSubtitle: {
    fontSize: width * 0.03,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  roadContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    alignItems: 'center',
  },
  roadSegment1: {
    position: 'absolute',
    top: 40,
    left: '50%',
    width: 8,
    height: 60,
    backgroundColor: '#A5D6A7',
    borderRadius: 4,
    opacity: 0.6,
  },
  roadSegment2: {
    position: 'absolute',
    top: 90,
    left: '30%',
    width: 8,
    height: 70,
    backgroundColor: '#A5D6A7',
    borderRadius: 4,
    opacity: 0.6,
    transform: [{ rotate: '-20deg' }],
  },
  roadSegment3: {
    position: 'absolute',
    top: 150,
    right: '25%',
    width: 8,
    height: 80,
    backgroundColor: '#A5D6A7',
    borderRadius: 4,
    opacity: 0.6,
    transform: [{ rotate: '25deg' }],
  },
  roadSegment4: {
    position: 'absolute',
    top: 220,
    left: '35%',
    width: 8,
    height: 70,
    backgroundColor: '#A5D6A7',
    borderRadius: 4,
    opacity: 0.6,
    transform: [{ rotate: '-15deg' }],
  },
  roadSegment5: {
    position: 'absolute',
    top: 280,
    right: '30%',
    width: 8,
    height: 75,
    backgroundColor: '#A5D6A7',
    borderRadius: 4,
    opacity: 0.6,
    transform: [{ rotate: '18deg' }],
  },
  roadSegment6: {
    position: 'absolute',
    top: 350,
    left: '50%',
    width: 8,
    height: 60,
    backgroundColor: '#A5D6A7',
    borderRadius: 4,
    opacity: 0.6,
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
  },
  bottomSpace: {
    height: 40,
  },
});

export default HomeScreen;