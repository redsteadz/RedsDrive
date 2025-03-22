"use client"

import { useState } from "react"
import { FileIcon, FolderIcon, ImageIcon, MoreVertical, Music, Search, Upload, Video } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { mockData } from "~/lib/mock-data"
import { cn } from "~/lib/utils"

export function Drive() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentPath, setCurrentPath] = useState<string[]>([])

  // Get current folder data based on path
  const getCurrentFolder = () => {
    let current = mockData
    for (const path of currentPath) {
      const folder = current.items.find((item) => item.type === "folder" && item.name === path) as typeof mockData
      if (folder) current = folder
    }
    return current
  }

  const currentFolder = getCurrentFolder()

  // Navigate to a folder
  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName])
  }

  // Navigate up one level
  const navigateUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  // Add a new function to handle file clicks after the navigateUp function
  const handleFileClick = (fileName: string, mimeType?: string) => {
    // In a real application, this would open the file or navigate to a file viewer
    // For this demo, we'll just show an alert
    alert(`Opening file: ${fileName}`)
  }

  // Get icon based on file type
  const getFileIcon = (type: string, mimeType?: string) => {
    if (type === "folder") return <FolderIcon className="w-6 h-6 text-blue-400" />
    if (mimeType?.startsWith("image/")) return <ImageIcon className="w-6 h-6 text-green-400" />
    if (mimeType?.startsWith("video/")) return <Video className="w-6 h-6 text-red-400" />
    if (mimeType?.startsWith("audio/")) return <Music className="w-6 h-6 text-yellow-400" />
    return <FileIcon className="w-6 h-6 text-gray-400" />
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-background p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">D</div>
          <h1 className="text-xl font-semibold">Drive</h1>
        </div>

        <Button
          className="justify-start gap-2 mb-6 bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            // Mock upload functionality
            alert("Upload functionality would go here")
          }}
        >
          <Upload className="h-4 w-4" />
          New Upload
        </Button>

        <nav className="space-y-1">
          {["My Drive", "Shared with me", "Recent", "Starred", "Trash"].map((item) => (
            <Button
              key={item}
              variant="ghost"
              className={cn("w-full justify-start text-foreground", item === "My Drive" && "bg-muted")}
            >
              {item}
            </Button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="flex items-center gap-2 text-xs text-foreground">
            <div>Storage: 2.5 GB / 15 GB</div>
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-muted">
            <div className="h-1 w-[20%] rounded-full bg-blue-600" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
              <path d="M12 3v6" />
            </svg>
            <span className="sr-only">Home</span>
          </Button>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search files..." className="w-full pl-8 bg-muted/50" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 p-4 text-sm">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPath([])} className="font-medium">
            My Drive
          </Button>

          {currentPath.map((path, index) => (
            <div key={path} className="flex items-center">
              <span className="mx-1 text-muted-foreground">/</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                className="font-medium"
              >
                {path}
              </Button>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="px-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {currentFolder.items.map((item, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-start gap-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (item.type === "folder") {
                      navigateToFolder(item.name)
                    } else {
                      handleFileClick(item.name, item.mimeType)
                    }
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    {getFileIcon(item.type, item.mimeType)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Move</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="w-full">
                    <div className="font-medium truncate text-foreground">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.type === "folder"
                        ? `${(item as typeof mockData).items.length} items`
                        : `${item.size} • ${item.modified}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="folders" className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {currentFolder.items
                .filter((item) => item.type === "folder")
                .map((item, i) => (
                  <div
                    key={i}
                    className="group relative flex flex-col items-start gap-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    onClick={() => navigateToFolder(item.name)}
                  >
                    <div className="flex w-full items-center justify-between">
                      <FolderIcon className="w-6 h-6 text-blue-400" />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem>Move</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="w-full">
                      <div className="font-medium truncate text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {`${(item as typeof mockData).items.length} items`}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="files" className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {currentFolder.items
                .filter((item) => item.type === "file")
                .map((item, i) => (
                  <div
                    key={i}
                    className="group relative flex flex-col items-start gap-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleFileClick(item.name, item.mimeType)}
                  >
                    <div className="flex w-full items-center justify-between">
                      {getFileIcon(item.type, item.mimeType)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem>Move</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="w-full">
                      <div className="font-medium truncate text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{`${item.size} • ${item.modified}`}</div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

