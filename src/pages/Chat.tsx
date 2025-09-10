import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeCard } from "@/components/ui/safe-card"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  Heart, 
  Sun, 
  Users,
  MessageCircle,
  Sparkles,
  ExternalLink
} from "lucide-react"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface MoodSuggestion {
  label: string
  icon: React.ReactNode
  response: string
  followUp?: string[]
}

const Chat = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello, I'm here to listen and support you. How are you feeling today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const moodSuggestions: MoodSuggestion[] = [
    {
      label: "Relaxation",
      icon: <Heart className="h-4 w-4" />,
      response: "Let's try some gentle breathing together. Breathe in slowly for 4 counts... hold for 4... and out for 6. You're doing great.",
      followUp: ["Deep breathing", "Guided imagery", "Progressive relaxation"]
    },
    {
      label: "Motivation",
      icon: <Sun className="h-4 w-4" />,
      response: "You've already taken a brave step by reaching out. One small step forward is still progress. You matter, and your feelings are valid.",
      followUp: ["Daily affirmations", "Goal setting", "Success reminders"]
    },
    {
      label: "Talk to Someone",
      icon: <Users className="h-4 w-4" />,
      response: "Sometimes talking to a professional can really help. Would you like me to share some trusted helpline numbers or local support centers?",
      followUp: ["Emergency contacts", "Counselor referrals", "Support groups"]
    }
  ]

  const emergencyResources = [
    { name: "National Crisis Helpline", number: "988", description: "24/7 crisis support" },
    { name: "Women's Safety Helpline", number: "1091", description: "Immediate help for women" },
    { name: "Domestic Violence Hotline", number: "1800-799-7233", description: "Confidential support" }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const detectSentiment = (text: string) => {
    const lowerText = text.toLowerCase()
    
    // Crisis keywords
    const crisisKeywords = [
      "kill myself", "end it all", "don't want to live", "suicide", 
      "hurt myself", "no point", "give up", "hopeless", "worthless"
    ]
    
    // Depression indicators
    const depressionKeywords = [
      "depressed", "sad all the time", "hopeless", "empty", 
      "numb", "can't go on", "tired of life", "nothing matters"
    ]
    
    // Distress indicators  
    const distressKeywords = [
      "anxious", "scared", "terrified", "panicking", "overwhelmed",
      "frustrated", "angry", "can't cope", "stressed"
    ]

    if (crisisKeywords.some(keyword => lowerText.includes(keyword))) {
      return "crisis"
    } else if (depressionKeywords.some(keyword => lowerText.includes(keyword))) {
      return "depression"
    } else if (distressKeywords.some(keyword => lowerText.includes(keyword))) {
      return "distress"
    }
    return "general"
  }

  const generateResponse = (userMessage: string) => {
    const sentiment = detectSentiment(userMessage)
    
    const responses = {
      crisis: [
        "I hear you, and I'm really concerned about you. You're not alone, and there are people who want to help. Would you like me to share some crisis support numbers?",
        "Thank you for trusting me with how you're feeling. Your life has value. Please consider reaching out to a crisis counselor who can provide immediate support."
      ],
      depression: [
        "I hear you. You're not alone in feeling this way. It's okay to have these feelings - they don't define you.",
        "That sounds really difficult. Your feelings are valid, and it's brave of you to share them. Would you like me to guide you through some gentle coping techniques?",
        "I'm here with you. Depression can make everything feel overwhelming, but small steps can help. Would you like to try a grounding exercise together?"
      ],
      distress: [
        "That sounds really tough. Your feelings are completely valid. Do you want me to guide you through some stress relief steps?",
        "I can hear how difficult this is for you. Let's take this one moment at a time. Would some calming techniques help right now?",
        "You're dealing with a lot. It's normal to feel overwhelmed. Would you like to try some breathing exercises or talk through what's on your mind?"
      ],
      general: [
        "Thank you for sharing with me. I'm here to listen. How can I best support you right now?",
        "I hear you. What would feel most helpful to you in this moment?",
        "You've taken a positive step by reaching out. What's on your mind today?"
      ]
    }

    return responses[sentiment][Math.floor(Math.random() * responses[sentiment].length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleMoodSuggestion = (suggestion: MoodSuggestion) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `I need help with ${suggestion.label.toLowerCase()}`,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: suggestion.response,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-soft-gradient flex flex-col">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-primary/10 px-6 py-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <SafeButton
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </SafeButton>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 rounded-full">
              <MessageCircle className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-primary">AI Helper</h1>
              <p className="text-sm text-muted-foreground">Here to listen and support</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mood Suggestions */}
      <div className="px-6 py-4 bg-background/50 border-b border-primary/5 flex-shrink-0">
        <div className="flex space-x-3 overflow-x-auto">
          {moodSuggestions.map((suggestion, index) => (
            <SafeButton
              key={index}
              variant="soft"
              size="sm"
              className="flex items-center space-x-2 whitespace-nowrap"
              onClick={() => handleMoodSuggestion(suggestion)}
            >
              {suggestion.icon}
              <span>{suggestion.label}</span>
            </SafeButton>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent/10 text-foreground border border-accent/20'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-accent/10 border border-accent/20 rounded-2xl px-4 py-3 max-w-[80%]">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs text-muted-foreground ml-2">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emergency Resources */}
      <div className="px-6 py-4 bg-background/50 border-t border-primary/5">
        <SafeCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-primary flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Need More Help?</span>
            </h3>
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <div className="space-y-2">
            {emergencyResources.map((resource, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{resource.name}</p>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </div>
                <SafeButton
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${resource.number}`, '_self')}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </SafeButton>
              </div>
            ))}
          </div>
        </SafeCard>
      </div>

      {/* Input */}
      <div className="px-6 py-4 bg-background/80 backdrop-blur-sm border-t border-primary/10 flex-shrink-0">
        <div className="flex space-x-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Share what's on your mind..."
            className="flex-1 rounded-xl border-primary/20 focus:border-primary"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <SafeButton
            variant="primary"
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </SafeButton>
        </div>
      </div>
    </div>
  )
}

export default Chat