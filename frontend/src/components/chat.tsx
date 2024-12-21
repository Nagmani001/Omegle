
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from 'lucide-react'
import { handleReplyMessage, handleSendMessage, offSocket } from '@/lib/webrtc'

interface Message {
  sender: 'Stranger' | 'You'
  content: string
}

export default function OmegleChat() {
  const [messages, setMessages] = useState<Message[]>([
  ])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    handleReplyMessage(setMessages);
    return () => {
      offSocket();
      setInputMessage("");
    }
  }, [messages])
  useEffect(() => {
    handleReplyMessage(setMessages);
    return () => {
      offSocket();
      setInputMessage("");
    }
  }, [])

  return (
    <Card className="w-full max-w-5xl mx-auto h-[960px] flex flex-col">
      <CardContent className="flex-grow p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'You'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                    }`}
                >
                  <p className="font-semibold mb-1">{message.sender}:</p>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage(inputMessage, setMessages)
          }}
          className="flex w-full space-x-2"
        >
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

