import { useNavigate } from "react-router-dom"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeCard, SafeCardContent, SafeCardDescription, SafeCardHeader, SafeCardTitle } from "@/components/ui/safe-card"
import { 
  FileText, 
  AlertTriangle, 
  MessageCircle, 
  Map, 
  Bell, 
  User,
  Home,
  HeadphonesIcon,
  Shield
} from "lucide-react"

const Dashboard = () => {
  const navigate = useNavigate()

  const quickActions = [
    {
      title: "Report Incident",
      description: "Anonymous and secure reporting",
      icon: FileText,
      action: () => navigate("/report"),
      variant: "primary" as const,
      urgent: false
    },
    {
      title: "SOS Emergency",
      description: "Get immediate help",
      icon: AlertTriangle,
      action: () => navigate("/emergency"),
      variant: "emergency" as const,
      urgent: true
    },
    {
      title: "AI Helper",
      description: "Chat for support and guidance",
      icon: MessageCircle,
      action: () => navigate("/chat"),
      variant: "accent" as const,
      urgent: false
    },
    {
      title: "Safe Routes",
      description: "Find safer paths home",
      icon: Map,
      action: () => navigate("/routes"),
      variant: "secondary" as const,
      urgent: false
    }
  ]

  const navigationItems = [
    { icon: Home, label: "Home", active: true },
    { icon: FileText, label: "Reports" },
    { icon: HeadphonesIcon, label: "Support" },
    { icon: User, label: "Profile" }
  ]

  return (
    <div className="min-h-screen bg-soft-gradient">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-primary/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-primary">SafeHaven</h1>
            <p className="text-sm text-muted-foreground">You're safe here 🌸</p>
          </div>
          <div className="flex items-center space-x-2">
            <SafeButton
              variant="ghost"
              size="icon"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5" />
            </SafeButton>
            <SafeButton
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
            >
              <User className="h-5 w-5" />
            </SafeButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 pb-24">
        {/* Welcome Message */}
        <div className="mb-6 p-4 bg-primary-soft rounded-xl border border-primary/20">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h2 className="font-medium text-primary">Welcome to your safe space</h2>
              <p className="text-sm text-primary/80">We're here to support you every step of the way</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Access</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action, index) => (
              <SafeCard
                key={index}
                className={`cursor-pointer transition-all duration-200 ${
                  action.urgent ? 'ring-2 ring-emergency/20' : ''
                }`}
                onClick={action.action}
              >
                <SafeCardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${
                      action.variant === 'emergency' ? 'bg-emergency/10' :
                      action.variant === 'primary' ? 'bg-primary/10' :
                      action.variant === 'accent' ? 'bg-accent/10' :
                      'bg-secondary/10'
                    }`}>
                      <action.icon className={`h-6 w-6 ${
                        action.variant === 'emergency' ? 'text-emergency' :
                        action.variant === 'primary' ? 'text-primary' :
                        action.variant === 'accent' ? 'text-accent' :
                        'text-secondary'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <SafeCardTitle className="text-base">{action.title}</SafeCardTitle>
                      <SafeCardDescription>{action.description}</SafeCardDescription>
                    </div>
                  </div>
                </SafeCardHeader>
              </SafeCard>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <SafeCard>
            <SafeCardContent className="py-6">
              <p className="text-center text-muted-foreground">
                No recent activity. Your privacy is protected.
              </p>
            </SafeCardContent>
          </SafeCard>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-primary/10 px-6 py-3">
        <div className="flex items-center justify-around">
          {navigationItems.map((item, index) => (
            <SafeButton
              key={index}
              variant="ghost"
              className={`flex flex-col items-center space-y-1 h-auto py-2 ${
                item.active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </SafeButton>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Dashboard