import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Image,
  Smile,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  MessageSquare,
  Bell,
  Settings,
  Search,
  Filter,
  Plus
} from "lucide-react";

const mockPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Johnson",
      username: "@sarahj",
      avatar: "https://via.placeholder.com/40",
      verified: true
    },
    content: "Just finished an amazing hike in the mountains! The view was absolutely breathtaking. Sometimes you need to disconnect from the digital world to truly appreciate nature. 🏔️✨ #NatureLover #HikingAdventures",
    images: ["https://via.placeholder.com/500x300"],
    timestamp: "2 hours ago",
    likes: 124,
    comments: 23,
    shares: 8,
    liked: false,
    type: "post"
  },
  {
    id: 2,
    author: {
      name: "Tech Innovator",
      username: "@techguru",
      avatar: "https://via.placeholder.com/40",
      verified: false
    },
    content: "Exciting news! Our new AI-powered app just launched. It's designed to help developers build faster and more efficiently. The future of coding is here! 🚀 #TechInnovation #AI #Coding",
    images: [],
    timestamp: "4 hours ago",
    likes: 89,
    comments: 15,
    shares: 12,
    liked: true,
    type: "post"
  },
  {
    id: 3,
    author: {
      name: "Foodie Adventures",
      username: "@foodieadventures",
      avatar: "https://via.placeholder.com/40",
      verified: true
    },
    content: "Tried this amazing new restaurant downtown. The fusion cuisine was incredible! The chef really knows how to blend different culinary traditions. Definitely worth a visit! 🍜🍱 #Foodie #RestaurantReview",
    images: ["https://via.placeholder.com/500x300", "https://via.placeholder.com/500x300"],
    timestamp: "6 hours ago",
    likes: 67,
    comments: 31,
    shares: 5,
    liked: false,
    type: "post"
  }
];

const trendingTopics = [
  { tag: "#TechInnovation", posts: 1250 },
  { tag: "#NatureLover", posts: 890 },
  { tag: "#Foodie", posts: 756 },
  { tag: "#Coding", posts: 623 },
  { tag: "#HikingAdventures", posts: 445 }
];

const suggestedUsers = [
  { name: "Design Studio", username: "@designstudio", avatar: "https://via.placeholder.com/40", followers: 15420 },
  { name: "Code Masters", username: "@codemasters", avatar: "https://via.placeholder.com/40", followers: 12340 },
  { name: "Travel Diaries", username: "@traveldiaries", avatar: "https://via.placeholder.com/40", followers: 9870 }
];

export default function Feed() {
  const [activeTab, setActiveTab] = useState("for-you");
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState(mockPosts);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        author: {
          name: "You",
          username: "@you",
          avatar: "https://via.placeholder.com/40",
          verified: false
        },
        content: newPostContent,
        images: [],
        timestamp: "now",
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        type: "post" as const
      };
      setPosts([newPost, ...posts]);
      setNewPostContent("");
    }
  };

  const PostCard = ({ post }: { post: typeof mockPosts[0] }) => (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold">{post.author.name}</span>
              {post.author.verified && <Badge className="bg-blue-500 text-xs px-1 py-0">✓</Badge>}
              <span className="text-gray-500 text-sm">{post.author.username}</span>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-500 text-sm">{post.timestamp}</span>
            </div>

            <p className="text-gray-900 mb-4 whitespace-pre-wrap">{post.content}</p>

            {post.images.length > 0 && (
              <div className={`grid gap-2 mb-4 ${
                post.images.length === 1 ? 'grid-cols-1' :
                post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'
              }`}>
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="rounded-lg w-full h-64 object-cover"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-2 ${post.liked ? 'text-red-500' : ''}`}
              >
                <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </Button>

              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </Button>

              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Share className="w-4 h-4" />
                <span>{post.shares}</span>
              </Button>

              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card>
              <CardContent className="p-6">
                <div className="flex space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://via.placeholder.com/40" alt="You" />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <Textarea
                      placeholder="What's happening?"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[100px] resize-none border-none shadow-none p-0 focus-visible:ring-0"
                    />

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Image className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Smile className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Calendar className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feed Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="for-you">For You</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search posts..." className="pl-10" />
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{topic.tag}</div>
                        <div className="text-xs text-gray-500">{topic.posts.toLocaleString()} posts</div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggested Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Who to Follow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.followers.toLocaleString()} followers</div>
                        </div>
                      </div>
                      <Button size="sm">Follow</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="flex flex-col items-center py-4">
                    <MessageSquare className="w-4 h-4 mb-1" />
                    <span className="text-xs">Messages</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col items-center py-4">
                    <Users className="w-4 h-4 mb-1" />
                    <span className="text-xs">Groups</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col items-center py-4">
                    <Bell className="w-4 h-4 mb-1" />
                    <span className="text-xs">Notifications</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col items-center py-4">
                    <Settings className="w-4 h-4 mb-1" />
                    <span className="text-xs">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="https://via.placeholder.com/24" />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <span><strong>Alice</strong> liked your post</span>
                    <span className="text-gray-500">2m</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="https://via.placeholder.com/24" />
                      <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <span><strong>Bob</strong> commented on your post</span>
                    <span className="text-gray-500">5m</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="https://via.placeholder.com/24" />
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <span><strong>Carol</strong> started following you</span>
                    <span className="text-gray-500">1h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sponsored Content */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 mb-2">Sponsored</div>
                  <div className="text-xs text-gray-600 mb-3">
                    Upgrade to Pro for advanced analytics
                  </div>
                  <Button size="sm" className="w-full">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
