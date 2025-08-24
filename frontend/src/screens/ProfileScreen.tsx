import React, { useState, useRef, useCallback } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    PanResponder,
    Animated,
    Dimensions,
    StyleSheet,
    Easing,
} from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface ScrapbookPage {
    id: number
    week: number
    title: string
    storybooks: string[]
    parentTime: string
    learnings: string[]
}

const ProfileScreen: React.FC = () => {
    const [currentSpread, setCurrentSpread] = useState(0)
    const [isBookOpen, setIsBookOpen] = useState(false)

    const bookAnim = useRef(new Animated.Value(0)).current // 0=closed, 1=open
    const leftPageAnim = useRef(new Animated.Value(0)).current
    const rightPageAnim = useRef(new Animated.Value(0)).current
    const contentFadeAnim = useRef(new Animated.Value(0)).current
    const isFlipping = useRef(false)
    const flipDirection = useRef<'next' | 'prev'>('next')

    const pages: ScrapbookPage[] = [
        {
            id: 1,
            week: 1,
            title: 'Week 1',
            storybooks: [
                'The Very Hungry Caterpillar',
                'Brown Bear, Brown Bear',
            ],
            parentTime: '3 hours',
            learnings: [
                'Learned about colors and animals',
                'Counted from 1 to 10',
                'Practiced writing my name',
            ],
        },
        {
            id: 2,
            week: 2,
            title: 'Week 2',
            storybooks: ['The Tiny Seed', 'The Grouchy Ladybug'],
            parentTime: '4 hours',
            learnings: [
                'Learned about plant life cycles',
                'Identified different insects',
                'Practiced addition with small numbers',
            ],
        },
        {
            id: 3,
            week: 3,
            title: 'Week 3',
            storybooks: ['Polar Bear, Polar Bear', 'Panda Bear, Panda Bear'],
            parentTime: '5 hours',
            learnings: [
                'Learned about animal habitats',
                'Practiced reading simple words',
                'Created patterns with colors and shapes',
            ],
        },
        {
            id: 4,
            week: 4,
            title: 'Week 4',
            storybooks: ['Where the Wild Things Are', 'Goodnight Moon'],
            parentTime: '6 hours',
            learnings: [
                'Used imagination to create stories',
                'Learned about day and night cycles',
                'Practiced measuring objects',
            ],
        },
        {
            id: 5,
            week: 5,
            title: 'Week 5',
            storybooks: ['Chicka Chicka Boom Boom', 'Dr. Seuss’s ABC'],
            parentTime: '3.5 hours',
            learnings: [
                'Recognized uppercase and lowercase letters',
                'Matched letters with beginning sounds',
                'Practiced tracing alphabet letters',
            ],
        },
        {
            id: 6,
            week: 6,
            title: 'Week 6',
            storybooks: ['I See', 'We Play'],
            parentTime: '4.5 hours',
            learnings: [
                'Read and recognized first 10 sight words (I, see, a, the, we, like, and, go, to, play)',
                'Played memory games with sight words',
                'Pointed and read sight words in short sentences',
            ],
        },
        {
            id: 7,
            week: 7,
            title: 'Week 7',
            storybooks: ['First 100 Words', 'My Big Animal Book'],
            parentTime: '5 hours',
            learnings: [
                'Learned new words for everyday objects',
                'Sorted words into groups (food, animals, toys)',
                'Practiced saying new words with actions',
            ],
        },
        {
            id: 8,
            week: 8,
            title: 'Week 8',
            storybooks: ['Rhyming Dust Bunnies', 'Hop on Pop'],
            parentTime: '6 hours',
            learnings: [
                'Clapped out syllables in words',
                'Practiced rhyming word families (cat, bat, hat)',
                'Listened and identified beginning sounds in words',
            ],
        },
    ]

    const leftPageIndex = currentSpread * 2
    const rightPageIndex = currentSpread * 2 + 1

    // Open or close book
    const toggleBook = () => {
        if (isFlipping.current) return

        const toValue = isBookOpen ? 0 : 1

        Animated.timing(bookAnim, {
            toValue,
            duration: 800,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
        }).start(() => {
            setIsBookOpen(!isBookOpen)

            if (!isBookOpen) {
                // Reset to first page when opening
                setCurrentSpread(0)
                contentFadeAnim.setValue(1)
            } else {
                contentFadeAnim.setValue(0)
            }
        })
    }

    const flipToNextSpread = useCallback(() => {
        if (isFlipping.current || currentSpread >= Math.floor(pages.length / 2))
            return
        isFlipping.current = true
        flipDirection.current = 'next'

        Animated.parallel([
            Animated.timing(leftPageAnim, {
                toValue: 1,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(rightPageAnim, {
                toValue: 1,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(contentFadeAnim, {
                toValue: 0,
                duration: 350,
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (finished) {
                setCurrentSpread((prev) => prev + 1)
                leftPageAnim.setValue(0)
                rightPageAnim.setValue(0)
                Animated.timing(contentFadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }).start()
                isFlipping.current = false
            }
        })
    }, [
        currentSpread,
        pages.length,
        contentFadeAnim,
        leftPageAnim,
        rightPageAnim,
    ])

    const flipToPrevSpread = useCallback(() => {
        if (isFlipping.current || currentSpread <= 0) return
        isFlipping.current = true
        flipDirection.current = 'prev'

        Animated.parallel([
            Animated.timing(leftPageAnim, {
                toValue: 1,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(rightPageAnim, {
                toValue: 1,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(contentFadeAnim, {
                toValue: 0,
                duration: 350,
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (finished) {
                setCurrentSpread((prev) => prev - 1)
                leftPageAnim.setValue(0)
                rightPageAnim.setValue(0)
                Animated.timing(contentFadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }).start()
                isFlipping.current = false
            }
        })
    }, [currentSpread, leftPageAnim, rightPageAnim, contentFadeAnim])

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () =>
                !isFlipping.current && isBookOpen,
            onMoveShouldSetPanResponder: (_, gestureState) =>
                Math.abs(gestureState.dx) > 10 &&
                !isFlipping.current &&
                isBookOpen,
            onPanResponderRelease: (_, gestureState) => {
                if (isFlipping.current || !isBookOpen) return
                if (gestureState.dx < -50) flipToNextSpread()
                else if (gestureState.dx > 50) flipToPrevSpread()
            },
        })
    ).current

    const leftPageInterpolate = leftPageAnim.interpolate({
        inputRange: [0, 1],
        outputRange:
            flipDirection.current === 'next'
                ? ['0deg', '-180deg']
                : ['0deg', '180deg'],
    })

    const rightPageInterpolate = rightPageAnim.interpolate({
        inputRange: [0, 1],
        outputRange:
            flipDirection.current === 'next'
                ? ['0deg', '-180deg']
                : ['0deg', '180deg'],
    })

    const bookScale = bookAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
    })

    const renderPageContent = useCallback(
        (page: ScrapbookPage) => (
            <Animated.ScrollView
                style={[styles.pageContent, { opacity: contentFadeAnim }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.pageTitle}>{page.title}</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Time with Parents</Text>
                    <Text style={styles.listText}>{page.parentTime}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Storybooks I Finished
                    </Text>
                    {page.storybooks.map((book, index) => (
                        <Text key={index} style={styles.listText}>
                            📖 {book}
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What I Learned</Text>
                    {page.learnings.map((item, index) => (
                        <Text key={index} style={styles.listText}>
                            🌟 {item}
                        </Text>
                    ))}
                </View>
            </Animated.ScrollView>
        ),
        [contentFadeAnim]
    )

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Learning Scrapbook</Text>

            <TouchableOpacity onPress={toggleBook} activeOpacity={0.9}>
                <Animated.View
                    style={[
                        styles.bookContainer,
                        { transform: [{ scale: bookScale }] },
                    ]}
                    {...(isBookOpen ? panResponder.panHandlers : {})}
                >
                    <View style={styles.bookBackground}>
                        <View style={styles.bookBinding} />
                        {isBookOpen && (
                            <View style={styles.pagesContainer}>
                                {leftPageIndex < pages.length && (
                                    <Animated.View
                                        style={[
                                            styles.page,
                                            styles.leftPage,
                                            {
                                                transform: [
                                                    {
                                                        rotateY:
                                                            leftPageInterpolate,
                                                    },
                                                    { perspective: 1200 },
                                                ],
                                            },
                                        ]}
                                    >
                                        {renderPageContent(
                                            pages[leftPageIndex]
                                        )}
                                    </Animated.View>
                                )}
                                {rightPageIndex < pages.length && (
                                    <Animated.View
                                        style={[
                                            styles.page,
                                            styles.rightPage,
                                            {
                                                transform: [
                                                    {
                                                        rotateY:
                                                            rightPageInterpolate,
                                                    },
                                                    { perspective: 1200 },
                                                ],
                                            },
                                        ]}
                                    >
                                        {renderPageContent(
                                            pages[rightPageIndex]
                                        )}
                                    </Animated.View>
                                )}
                            </View>
                        )}
                        {!isBookOpen && (
                            <View
                                style={[
                                    styles.page,
                                    styles.leftPage,
                                    styles.blankPage,
                                ]}
                            >
                                <Text style={styles.blankPageText}>
                                    📖 Tap to Open
                                </Text>
                            </View>
                        )}
                    </View>
                </Animated.View>
            </TouchableOpacity>

            {isBookOpen && (
                <View style={styles.navigation}>
                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            currentSpread === 0 && styles.disabledButton,
                        ]}
                        onPress={flipToPrevSpread}
                        disabled={currentSpread === 0 || isFlipping.current}
                    >
                        <Text style={styles.navButtonText}>← Previous</Text>
                    </TouchableOpacity>

                    <Text style={styles.pageIndicator}>
                        {Math.min(
                            currentSpread + 1,
                            Math.ceil(pages.length / 2)
                        )}{' '}
                        / {Math.ceil(pages.length / 2)}
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            currentSpread >= Math.floor(pages.length / 2) &&
                                styles.disabledButton,
                        ]}
                        onPress={flipToNextSpread}
                        disabled={
                            currentSpread >= Math.floor(pages.length / 2) ||
                            isFlipping.current
                        }
                    >
                        <Text style={styles.navButtonText}>Next →</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f4ea', // very light pastel blue
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5A86B9', // muted darker pastel blue
        marginBottom: 20,
        textAlign: 'center',
    },
    bookContainer: {
        width: SCREEN_WIDTH * 0.85,
        height: SCREEN_WIDTH * 0.85 * 1.2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#CFE8FF', // soft pastel shadow
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
        marginBottom: 20,
    },
    bookBackground: {
        width: '100%',
        height: '100%',
        backgroundColor: '#B0D4FF', // pastel blue
        borderRadius: 15,
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative',
    },
    bookBinding: {
        width: 12,
        height: '100%',
        backgroundColor: '#5A86B9', // muted darker pastel blue
        position: 'absolute',
        left: '50%',
        marginLeft: -6,
        zIndex: 1,
    },
    pagesContainer: { flex: 1, flexDirection: 'row', zIndex: 2 },
    page: {
        width: '50%',
        height: '100%',
        padding: 15,
        backfaceVisibility: 'hidden',
    },
    leftPage: {
        borderRightWidth: 1,
        borderRightColor: '#CFE8FF',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        backgroundColor: '#F5FAFF', // very soft pastel for page
    },
    rightPage: {
        borderLeftWidth: 1,
        borderLeftColor: '#CFE8FF',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        backgroundColor: '#F5FAFF',
    },
    pageContent: { flex: 1 },
    pageTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#5A86B9', // darker pastel
    },
    section: { marginBottom: 15 },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3B5C7E', // softer blue for section headings
        marginBottom: 5,
    },
    listText: { fontSize: 13, color: '#3B5C7E', lineHeight: 18 },
    blankPage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAF6FF',
    },
    blankPageText: {
        fontSize: 16,
        color: '#5A86B9',
        fontStyle: 'italic',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        marginTop: 10,
    },
    navButton: {
        backgroundColor: '#CFE8FF', // pastel button
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        minWidth: 100,
        alignItems: 'center',
    },
    disabledButton: { backgroundColor: '#E0E0E0' },
    navButtonText: { color: '#3B5C7E', fontWeight: 'bold', fontSize: 14 },
    pageIndicator: { fontSize: 16, fontWeight: 'bold', color: '#5A86B9' },
})

export default ProfileScreen
