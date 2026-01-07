import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Save,
  Eye,
  ArrowLeft,
  Upload,
  X,
  Calendar,
  Tag,
  Settings,
  FileText
} from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

export default function Editor() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishDate, setPublishDate] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: '<p>Start writing your amazing post...</p>',
    onUpdate: ({ editor }) => {
      // Handle content changes
    },
  });

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    const content = editor?.getHTML();
    console.log("Saving post:", {
      title,
      excerpt,
      content,
      category,
      tags,
      featured,
      published,
      publishDate,
      seoTitle,
      seoDescription,
      coverImage
    });
  };

  const handlePublish = () => {
    setPublished(true);
    handleSave();
  };

  const ToolbarButton = ({ onClick, isActive, children, title }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  );

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/blog">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
              <p className="text-gray-600">Write and publish your blog post</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handlePublish} disabled={published}>
              {published ? "Published" : "Publish"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Editor */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <Input
                      placeholder="Post title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-2xl font-bold border-none shadow-none p-0 h-auto focus-visible:ring-0"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <Textarea
                      placeholder="Write a brief excerpt..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  {/* Cover Image */}
                  <div>
                    <Label className="text-sm font-medium">Cover Image</Label>
                    <div className="mt-2">
                      {coverImage ? (
                        <div className="relative">
                          <img
                            src={coverImage}
                            alt="Cover"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setCoverImage("")}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload cover image</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Editor Toolbar */}
                  <div className="border rounded-lg">
                    <div className="border-b p-3">
                      <div className="flex flex-wrap gap-1">
                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleBold().run()}
                          isActive={editor.isActive('bold')}
                          title="Bold"
                        >
                          <Bold className="w-4 h-4" />
                        </ToolbarButton>

                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleItalic().run()}
                          isActive={editor.isActive('italic')}
                          title="Italic"
                        >
                          <Italic className="w-4 h-4" />
                        </ToolbarButton>

                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleUnderline().run()}
                          isActive={editor.isActive('underline')}
                          title="Underline"
                        >
                          <Underline className="w-4 h-4" />
                        </ToolbarButton>

                        <Separator orientation="vertical" className="mx-2 h-6" />

                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                          isActive={editor.isActive('heading', { level: 1 })}
                          title="Heading 1"
                        >
                          <Heading1 className="w-4 h-4" />
                        </ToolbarButton>

                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                          isActive={editor.isActive('heading', { level: 2 })}
                          title="Heading 2"
                        >
                          <Heading2 className="w-4 h-4" />
                        </ToolbarButton>

                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                          isActive={editor.isActive('heading', { level: 3 })}
                          title="Heading 3"
                        >
                          <Heading3 className="w-4 h-4" />
                        </ToolbarButton>

                        <Separator orientation="vertical" className="mx-2 h-6" />

                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
                          isActive={editor.isActive('bulletList')}
                          title="Bullet List"
                        >
                          <List className="w-4 h-4" />
                        </ToolbarButton>

                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleOrderedList().run()}
                          isActive={editor.isActive('orderedList')}
                          title="Ordered List"
                        >
                          <ListOrdered className="w-4 h-4" />
                        </ToolbarButton>

                        <Separator orientation="vertical" className="mx-2 h-6" />

                        <ToolbarButton
                          onClick={() => {
                            const url = window.prompt('URL');
                            if (url) {
                              editor.chain().focus().setLink({ href: url }).run();
                            }
                          }}
                          title="Add Link"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </ToolbarButton>

                        <ToolbarButton
                          onClick={() => {
                            const url = window.prompt('Image URL');
                            if (url) {
                              editor.chain().focus().setImage({ src: url }).run();
                            }
                          }}
                          title="Add Image"
                        >
                          <Image className="w-4 h-4" />
                        </ToolbarButton>

                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleBlockquote().run()}
                          isActive={editor.isActive('blockquote')}
                          title="Quote"
                        >
                          <Quote className="w-4 h-4" />
                        </ToolbarButton>

                        <ToolbarButton
                          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                          isActive={editor.isActive('codeBlock')}
                          title="Code Block"
                        >
                          <Code className="w-4 h-4" />
                        </ToolbarButton>
                      </div>
                    </div>

                    {/* Editor Content */}
                    <div className="p-4">
                      <EditorContent
                        editor={editor}
                        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[400px]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add tag..."
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured Post</Label>
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input
                    id="publishDate"
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    placeholder="Custom SEO title"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    placeholder="SEO description (150-160 characters)"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    {published ? "Post is published and live" : "Post is saved as draft"}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Word Count</span>
                    <span>{editor.getText().split(' ').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Reading Time</span>
                    <span>{Math.ceil(editor.getText().split(' ').length / 200)} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
