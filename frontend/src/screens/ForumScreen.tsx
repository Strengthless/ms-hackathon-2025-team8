import React, { useState } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import {
    Searchbar,
    Card,
    Title,
    Paragraph,
    TextInput,
    Button,
    Avatar,
    Text,
    FAB,
} from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { forumPosts } from '../constants/mockData'

// --- Auth/User context (replace with your real auth data) ---
type Role = 'parent' | 'org'
interface User {
    id: string
    role: Role
    name: string
}

const currentUser: User = {
    id: 'u1',
    role: 'parent',
    name: 'Anonymous Parent',
}

// --- Types ---
interface Reply {
    id: number
    content: string
    author: string
    timestamp: string
}

interface Post {
    id: number
    title: string
    content: string
    author: string
    timestamp: string
    replies: Reply[]
    likes: number
    isPublic: boolean
    ownerId: string
}

interface ForumPostProps {
    item: Post
}

const ForumScreen = () => {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [posts, setPosts] = useState<Post[]>(() =>
        forumPosts.map(
            (p: any, idx: number): Post => ({
                id: p.id ?? Date.now() + idx,
                title: p.title ?? t('forum.untitled', 'Untitled'),
                content: p.content ?? '',
                author:
                    p.author ?? t('forum.anonymousParent', 'Anonymous Parent'),
                timestamp: p.timestamp ?? new Date().toISOString(),
                replies: Array.isArray(p.replies) ? p.replies : [],
                likes: typeof p.likes === 'number' ? p.likes : 0,
                isPublic: p.isPublic ?? true,
                ownerId: p.ownerId ?? 'seed-user-1',
            })
        )
    )

    const [newPostTitle, setNewPostTitle] = useState<string>('')
    const [newPostContent, setNewPostContent] = useState<string>('')
    const [showNewPostForm, setShowNewPostForm] = useState<boolean>(false)
    const [replyTexts, setReplyTexts] = useState<Record<number, string>>({})
    const [showReplyInput, setShowReplyInput] = useState<
        Record<number, boolean>
    >({})
    const [activeTab, setActiveTab] = useState<'public' | 'private'>('public')

    const q = searchQuery.toLowerCase()
    const filteredPosts = posts.filter((post: Post) => {
        const matchesQuery =
            post.title.toLowerCase().includes(q) ||
            post.content.toLowerCase().includes(q)

        if (activeTab === 'public') return post.isPublic && matchesQuery

        const viewerCanSeePrivate =
            post.ownerId === currentUser.id || currentUser.role === 'org'
        return !post.isPublic && viewerCanSeePrivate && matchesQuery
    })

    const handleCreatePost = (): void => {
        if (!newPostTitle || !newPostContent) return

        const newPost: Post = {
            id: Date.now(),
            title: newPostTitle,
            content: newPostContent,
            author: currentUser.name,
            timestamp: new Date().toISOString(),
            replies: [],
            likes: 0,
            isPublic: activeTab === 'public',
            ownerId: currentUser.id,
        }

        setPosts([newPost, ...posts])
        setNewPostTitle('')
        setNewPostContent('')
        setShowNewPostForm(false)
    }

    const handleAddReply = (postId: number): void => {
        const replyContent = replyTexts[postId]
        if (!replyContent) return

        const post = posts.find((p) => p.id === postId)
        if (!post) return

        const canComment =
            post.isPublic ||
            post.ownerId === currentUser.id ||
            currentUser.role === 'org'
        if (!canComment) return

        const newReply: Reply = {
            id: Date.now(),
            content: replyContent,
            author: currentUser.name,
            timestamp: new Date().toISOString(),
        }

        const updatedPosts = posts.map((p: Post) =>
            p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p
        )

        setPosts(updatedPosts)
        setReplyTexts({ ...replyTexts, [postId]: '' })
        setShowReplyInput({ ...showReplyInput, [postId]: false })
    }

    const renderPost = ({ item }: ForumPostProps) => {
        const isOwner = item.ownerId === currentUser.id
        const canComment =
            item.isPublic || isOwner || currentUser.role === 'org'

        return (
            <Card style={styles.postCard}>
                <Card.Content>
                    <View style={styles.postHeader}>
                        <Avatar.Text
                            size={40}
                            label="AP"
                            style={styles.avatar}
                        />
                        <View style={styles.postInfo}>
                            <Text style={styles.author}>{item.author}</Text>
                            <Text style={styles.timestamp}>
                                {new Date(item.timestamp).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    <Title style={styles.postTitle}>
                        {item.title}{' '}
                        {!item.isPublic && (
                            <Text style={styles.privateLabel}>
                                {t('forum.privateLabel', '[Private]')}
                            </Text>
                        )}
                    </Title>

                    {!item.isPublic && isOwner && (
                        <Text style={styles.privateHint}>
                            {t(
                                'forum.privateHint',
                                'Only you and the REACH can view this.'
                            )}
                        </Text>
                    )}

                    <Paragraph style={styles.postContent}>
                        {item.content}
                    </Paragraph>

                    <View style={styles.postFooter}>
                        <View style={styles.reactionContainer}>
                            <Button
                                icon="thumb-up-outline"
                                mode="text"
                                compact
                                textColor="#357266"
                                onPress={() => {
                                    const updatedPosts = posts.map((p: Post) =>
                                        p.id === item.id
                                            ? { ...p, likes: p.likes + 1 }
                                            : p
                                    )
                                    setPosts(updatedPosts)
                                }}
                            >
                                {item.likes}
                            </Button>

                            {canComment && (
                                <Button
                                    icon="comment-outline"
                                    mode="text"
                                    compact
                                    textColor="#357266"
                                    onPress={() =>
                                        setShowReplyInput({
                                            ...showReplyInput,
                                            [item.id]: !showReplyInput[item.id],
                                        })
                                    }
                                >
                                    {t('forum.comment', 'Comment')}
                                </Button>
                            )}
                        </View>
                    </View>

                    {item.replies.length > 0 && (
                        <View style={styles.repliesContainer}>
                            {item.replies.map((reply: Reply) => (
                                <Card key={reply.id} style={styles.replyCard}>
                                    <Card.Content>
                                        <View style={styles.replyHeader}>
                                            <Avatar.Text
                                                size={32}
                                                label="AP"
                                                style={styles.replyAvatar}
                                            />
                                            <View style={styles.replyInfo}>
                                                <Text
                                                    style={styles.replyAuthor}
                                                >
                                                    {reply.author}
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.replyTimestamp
                                                    }
                                                >
                                                    {new Date(
                                                        reply.timestamp
                                                    ).toLocaleDateString()}
                                                </Text>
                                            </View>
                                        </View>
                                        <Paragraph>{reply.content}</Paragraph>
                                    </Card.Content>
                                </Card>
                            ))}
                        </View>
                    )}

                    {showReplyInput[item.id] && canComment && (
                        <>
                            <TextInput
                                placeholder={t(
                                    'forum.writeReply',
                                    'Write a reply...'
                                )}
                                value={replyTexts[item.id] || ''}
                                onChangeText={(text: string) =>
                                    setReplyTexts({
                                        ...replyTexts,
                                        [item.id]: text,
                                    })
                                }
                                mode="outlined"
                                style={styles.replyInput}
                            />
                            <Button
                                mode="contained"
                                onPress={() => handleAddReply(item.id)}
                                style={styles.replyButton}
                            >
                                {t('forum.reply', 'Reply')}
                            </Button>
                        </>
                    )}
                </Card.Content>
            </Card>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <Button
                    mode={activeTab === 'public' ? 'contained' : 'outlined'}
                    onPress={() => setActiveTab('public')}
                    style={[
                        styles.tabButton,
                        activeTab === 'public' && styles.tabButtonActive,
                    ]}
                    textColor={activeTab === 'public' ? 'white' : '#357266'}
                >
                    {t('forum.tabPublic', 'Public')}
                </Button>
                <Button
                    mode={activeTab === 'private' ? 'contained' : 'outlined'}
                    onPress={() => setActiveTab('private')}
                    style={[
                        styles.tabButton,
                        activeTab === 'private' && styles.tabButtonActive,
                    ]}
                    textColor={activeTab === 'private' ? 'white' : '#357266'}
                >
                    {t('forum.tabPrivate', 'Private')}
                </Button>
            </View>

            <Searchbar
                placeholder={t(
                    'forum.searchPlaceholder',
                    'Search discussions...'
                )}
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
            />

            <FlatList
                data={filteredPosts}
                renderItem={renderPost}
                keyExtractor={(item: Post) => item.id.toString()}
                ListHeaderComponent={
                    showNewPostForm ? (
                        <Card style={styles.newPostCard}>
                            <Card.Content>
                                <Title>
                                    {activeTab === 'public'
                                        ? t(
                                              'forum.createPublic',
                                              'Create Public Discussion'
                                          )
                                        : t(
                                              'forum.createPrivate',
                                              'Create Private Discussion'
                                          )}
                                </Title>
                                <TextInput
                                    label={t('forum.title', 'Title')}
                                    value={newPostTitle}
                                    onChangeText={setNewPostTitle}
                                    style={styles.input}
                                    mode="outlined"
                                />
                                <TextInput
                                    label={t(
                                        'forum.whatsOnMind',
                                        "What's on your mind?"
                                    )}
                                    value={newPostContent}
                                    onChangeText={setNewPostContent}
                                    multiline
                                    numberOfLines={4}
                                    style={styles.input}
                                    mode="outlined"
                                />
                                <View style={styles.buttonContainer}>
                                    <Button
                                        mode="outlined"
                                        onPress={() =>
                                            setShowNewPostForm(false)
                                        }
                                        textColor="#357266"
                                    >
                                        {t('common.cancel', 'Cancel')}
                                    </Button>
                                    <Button
                                        mode="contained"
                                        onPress={handleCreatePost}
                                        style={{ backgroundColor: '#357266' }}
                                    >
                                        {t('common.post', 'Post')}
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    ) : null
                }
            />

            <FAB
                style={styles.fab}
                icon="plus"
                label={
                    activeTab === 'public'
                        ? t('forum.newPublic', 'New Public')
                        : t('forum.newPrivate', 'New Private')
                }
                onPress={() => setShowNewPostForm(true)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    tabButton: {
        marginHorizontal: 8,
        flex: 1,
        borderColor: '#357266', // border green for outlined mode
    },
    tabButtonActive: {
        backgroundColor: '#357266', // active tab green
    },
    searchbar: { marginHorizontal: 16, marginBottom: 8 },
    newPostCard: { margin: 16, marginBottom: 8 },
    postCard: { margin: 16, marginBottom: 8 },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: { backgroundColor: '#4CAF50', marginRight: 12 },
    postInfo: { flex: 1 },
    author: { fontWeight: 'bold', fontSize: 14 },
    timestamp: { color: '#757575', fontSize: 12 },
    postTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    privateLabel: { fontSize: 14, fontWeight: 'bold', color: '#D32F2F' },
    privateHint: { fontSize: 12, color: '#B71C1C', marginBottom: 8 },
    postContent: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reactionContainer: { flexDirection: 'row' },
    repliesContainer: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 16,
    },
    replyCard: { backgroundColor: '#FAFAFA', marginBottom: 8 },
    replyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    replyAvatar: { backgroundColor: '#66BB6A', marginRight: 8 },
    replyInfo: { flex: 1 },
    replyAuthor: { fontWeight: 'bold', fontSize: 12 },
    replyTimestamp: { color: '#9E9E9E', fontSize: 11 },
    input: { marginBottom: 12 },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#519872', // deep pastel green
    },
    replyInput: { marginTop: 12, marginBottom: 8 },
    replyButton: {
        alignSelf: 'flex-end',
        marginBottom: 8,
        backgroundColor: '#357266', // darker green for reply button
    },
})

export default ForumScreen
