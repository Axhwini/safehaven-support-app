import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeCard, SafeCardContent, SafeCardDescription, SafeCardHeader, SafeCardTitle } from "@/components/ui/safe-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Phone, 
  Heart, 
  Scale, 
  Search, 
  Filter,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Shield,
  Users,
  Building,
  Home,
  Eye
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LegalRight {
  id: string
  title: string
  category: 'women' | 'children' | 'workplace' | 'general'
  summary: string
  rightStatement: string
  detailedInfo: string
  sections: string[]
  keywords: string[]
}

const legalRights: LegalRight[] = [
  {
    id: 'domestic-violence',
    title: 'Protection from Domestic Violence Act, 2005',
    category: 'women',
    summary: 'Protects women from physical, emotional, sexual, and economic abuse by family members.',
    rightStatement: 'You have the right to live free from violence in your home and seek immediate protection.',
    detailedInfo: 'The Protection of Women from Domestic Violence Act, 2005 provides comprehensive protection to women against domestic violence. It covers not just physical violence, but also emotional, sexual, and economic abuse.',
    sections: [
      'Right to file complaints against domestic violence',
      'Right to protection orders from the court',
      'Right to residence orders (staying in shared household)',
      'Right to monetary relief for medical expenses and maintenance',
      'Right to custody orders for children',
      'Right to compensation for injuries and damages'
    ],
    keywords: ['domestic violence', 'family abuse', 'protection order', 'residence', 'maintenance']
  },
  {
    id: 'sexual-harassment-workplace',
    title: 'Sexual Harassment at Workplace Act, 2013 (POSH)',
    category: 'workplace',
    summary: 'Prevents and addresses sexual harassment at workplaces, ensuring safe working environments.',
    rightStatement: 'You have the right to work in an environment free from sexual harassment.',
    detailedInfo: 'The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 mandates every workplace to have an Internal Complaints Committee to address harassment complaints.',
    sections: [
      'Right to file complaints with Internal Complaints Committee',
      'Right to confidential inquiry process',
      'Right to interim relief during inquiry',
      'Right to compensation for mental trauma and career loss',
      'Right to transfer of complainant or respondent if needed',
      'Protection against retaliation for filing complaints'
    ],
    keywords: ['sexual harassment', 'workplace', 'POSH', 'office', 'colleague', 'boss']
  },
  {
    id: 'child-protection',
    title: 'Protection of Children from Sexual Offences Act, 2012 (POCSO)',
    category: 'children',
    summary: 'Comprehensive law protecting children from sexual abuse and exploitation.',
    rightStatement: 'Every child has the right to be protected from sexual abuse and exploitation.',
    detailedInfo: 'POCSO Act provides a robust legal framework for protection of children from sexual abuse. It defines different forms of sexual abuse and prescribes stringent punishment.',
    sections: [
      'Right to report abuse to authorities',
      'Right to special procedures during trial (child-friendly)',
      'Right to legal aid and support person during proceedings',
      'Right to compensation for rehabilitation',
      'Right to protection of identity during legal process',
      'Right to immediate medical care and counseling'
    ],
    keywords: ['child abuse', 'POCSO', 'minor', 'sexual abuse', 'child protection']
  },
  {
    id: 'ipc-sexual-assault',
    title: 'Sexual Assault Laws (IPC Sections 375-376)',
    category: 'women',
    summary: 'Laws defining and punishing sexual assault and rape with strict penalties.',
    rightStatement: 'You have the right to justice and protection under law for any sexual assault.',
    detailedInfo: 'Indian Penal Code Sections 375-376 define rape and sexual assault, with amendments in 2013 expanding the definition and increasing punishments.',
    sections: [
      'Right to file FIR immediately',
      'Right to medical examination by female doctor',
      'Right to record statement before magistrate',
      'Right to legal aid and representation',
      'Right to compensation from state',
      'Right to protection of identity in media'
    ],
    keywords: ['sexual assault', 'rape', 'IPC 375', 'IPC 376', 'FIR']
  },
  {
    id: 'stalking-harassment',
    title: 'Stalking and Harassment Laws (IPC Section 354D)',
    category: 'women',
    summary: 'Protection against stalking, following, and persistent unwanted contact.',
    rightStatement: 'You have the right to be free from stalking and persistent harassment.',
    detailedInfo: 'IPC Section 354D criminalizes stalking, including following, contacting, or attempting to contact a woman despite her disinterest.',
    sections: [
      'Right to file complaint for stalking behavior',
      'Right to restraining orders against stalker',
      'Right to police protection if threatened',
      'Right to compensation for harassment',
      'Right to privacy and freedom of movement',
      'Right to digital privacy protection'
    ],
    keywords: ['stalking', 'harassment', 'following', 'unwanted contact', 'IPC 354D']
  },
  {
    id: 'dowry-prohibition',
    title: 'Dowry Prohibition Act, 1961',
    category: 'women',
    summary: 'Prohibits giving, taking, or demanding dowry in marriages.',
    rightStatement: 'You have the right to marry without dowry demands or harassment.',
    detailedInfo: 'The Dowry Prohibition Act makes it illegal to give, take, or demand dowry. It also covers dowry-related harassment and violence.',
    sections: [
      'Right to marry without dowry demands',
      'Right to file complaints against dowry harassment',
      'Right to protection from dowry-related violence',
      'Right to return of dowry items',
      'Right to maintenance despite dowry issues',
      'Right to legal action against in-laws for dowry demands'
    ],
    keywords: ['dowry', 'marriage', 'in-laws', 'dowry harassment', 'wedding']
  }
]

const emergencyContacts = [
  {
    name: 'National Women Helpline',
    number: '181',
    description: '24/7 helpline for women in distress',
    type: 'helpline'
  },
  {
    name: 'Police Emergency',
    number: '100',
    description: 'Immediate police assistance',
    type: 'emergency'
  },
  {
    name: 'Child Helpline',
    number: '1098',
    description: '24/7 helpline for children in need',
    type: 'helpline'
  },
  {
    name: 'Domestic Violence Helpline',
    number: '181',
    description: 'Support for domestic violence survivors',
    type: 'helpline'
  }
]

const supportResources = [
  {
    name: 'Crisis Counseling Centers',
    description: 'Professional counseling and therapy services',
    icon: Heart,
    action: 'Find Centers'
  },
  {
    name: 'Safe Houses & Shelters',
    description: 'Temporary accommodation for women in crisis',
    icon: Home,
    action: 'Locate Shelters'
  },
  {
    name: 'Legal Aid Services',
    description: 'Free legal consultation and representation',
    icon: Scale,
    action: 'Get Legal Help'
  },
  {
    name: 'Support Groups',
    description: 'Connect with other survivors for mutual support',
    icon: Users,
    action: 'Join Groups'
  }
]

const HelpCentre = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [bookmarkedLaws, setBookmarkedLaws] = useState<string[]>([])
  const [quickExitMode, setQuickExitMode] = useState(false)

  const filteredLegalRights = legalRights.filter(law => {
    const matchesSearch = searchQuery === "" || 
      law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || law.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleBookmark = (lawId: string) => {
    setBookmarkedLaws(prev => {
      const newBookmarks = prev.includes(lawId) 
        ? prev.filter(id => id !== lawId)
        : [...prev, lawId]
      
      toast({
        title: prev.includes(lawId) ? "Bookmark removed" : "Law bookmarked",
        description: prev.includes(lawId) 
          ? "Removed from your saved laws" 
          : "Saved for offline reading"
      })
      
      return newBookmarks
    })
  }

  const quickExit = () => {
    setQuickExitMode(true)
    setTimeout(() => setQuickExitMode(false), 3000)
  }

  const callNumber = (number: string) => {
    window.open(`tel:${number}`)
  }

  if (quickExitMode) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="h-16 w-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
            📚
          </div>
          <h1 className="text-2xl font-bold mb-4">Study Materials</h1>
          <div className="space-y-3 w-full">
            {Array.from({length: 5}, (_, i) => (
              <div key={i} className="h-12 bg-muted rounded-lg"></div>
            ))}
          </div>
          <SafeButton 
            variant="ghost" 
            onClick={() => setQuickExitMode(false)}
            className="mt-4 text-xs"
          >
            Return to SafeHaven
          </SafeButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soft-gradient">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-primary/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SafeButton
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </SafeButton>
            <div>
              <h1 className="text-xl font-semibold text-primary">Help Centre</h1>
              <p className="text-sm text-muted-foreground">Support & Legal Resources</p>
            </div>
          </div>
          <SafeButton
            variant="ghost"
            size="sm"
            onClick={quickExit}
            className="text-xs"
          >
            <Eye className="h-4 w-4 mr-1" />
            Quick Exit
          </SafeButton>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        <Tabs defaultValue="legal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emergency" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Emergency</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Support</span>
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center space-x-2">
              <Scale className="h-4 w-4" />
              <span>Legal Rights</span>
            </TabsTrigger>
          </TabsList>

          {/* Emergency Contacts Tab */}
          <TabsContent value="emergency" className="space-y-4">
            <div className="bg-emergency/10 border border-emergency/20 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-emergency" />
                <div>
                  <h3 className="font-medium text-emergency">Emergency Contacts</h3>
                  <p className="text-sm text-emergency/80">Available 24/7 for immediate help</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {emergencyContacts.map((contact, index) => (
                <SafeCard key={index} className="cursor-pointer hover:shadow-calm">
                  <SafeCardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{contact.description}</p>
                        <Badge variant={contact.type === 'emergency' ? 'destructive' : 'default'}>
                          {contact.number}
                        </Badge>
                      </div>
                      <SafeButton
                        variant="primary"
                        size="sm"
                        onClick={() => callNumber(contact.number)}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </SafeButton>
                    </div>
                  </SafeCardContent>
                </SafeCard>
              ))}
            </div>
          </TabsContent>

          {/* Support Resources Tab */}
          <TabsContent value="support" className="space-y-4">
            <div className="bg-primary-soft border border-primary/20 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Heart className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium text-primary">Support Resources</h3>
                  <p className="text-sm text-primary/80">Professional help and community support</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {supportResources.map((resource, index) => (
                <SafeCard key={index} className="cursor-pointer hover:shadow-calm">
                  <SafeCardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-accent-soft rounded-xl">
                        <resource.icon className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{resource.name}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                      <SafeButton variant="outline" size="sm">
                        {resource.action}
                      </SafeButton>
                    </div>
                  </SafeCardContent>
                </SafeCard>
              ))}
            </div>
          </TabsContent>

          {/* Legal Rights & Laws Tab */}
          <TabsContent value="legal" className="space-y-6">
            {/* Introduction */}
            <div className="bg-accent-soft border border-accent/20 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Scale className="h-6 w-6 text-accent" />
                <div>
                  <h3 className="font-medium text-accent">Know Your Legal Rights</h3>
                  <p className="text-sm text-accent/80">
                    Understanding your rights is the first step towards protection and justice
                  </p>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search laws by keyword (e.g., harassment, workplace, children)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <SafeButton
                  variant={selectedCategory === "all" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Laws
                </SafeButton>
                <SafeButton
                  variant={selectedCategory === "women" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("women")}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Women
                </SafeButton>
                <SafeButton
                  variant={selectedCategory === "children" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("children")}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Children
                </SafeButton>
                <SafeButton
                  variant={selectedCategory === "workplace" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("workplace")}
                >
                  <Building className="h-4 w-4 mr-1" />
                  Workplace
                </SafeButton>
              </div>
            </div>

            {/* Legal Rights Cards */}
            <div className="space-y-4">
              {filteredLegalRights.length === 0 ? (
                <SafeCard>
                  <SafeCardContent className="p-8 text-center">
                    <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No laws found matching your search. Try different keywords.
                    </p>
                  </SafeCardContent>
                </SafeCard>
              ) : (
                filteredLegalRights.map((law) => (
                  <SafeCard key={law.id} className="hover:shadow-calm transition-all duration-200">
                    <SafeCardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="p-2 bg-accent-soft rounded-lg">
                            <Scale className="h-5 w-5 text-accent" />
                          </div>
                          <div className="flex-1">
                            <SafeCardTitle className="text-base leading-tight">
                              {law.title}
                            </SafeCardTitle>
                            <Badge 
                              variant="outline" 
                              className="mt-2 text-xs"
                            >
                              {law.category.charAt(0).toUpperCase() + law.category.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <SafeButton
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleBookmark(law.id)}
                          className="flex-shrink-0"
                        >
                          {bookmarkedLaws.includes(law.id) ? (
                            <BookmarkCheck className="h-4 w-4 text-primary" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </SafeButton>
                      </div>
                    </SafeCardHeader>
                    
                    <SafeCardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="p-3 bg-primary-soft rounded-lg border-l-4 border-primary">
                          <p className="text-sm font-medium text-primary">
                            {law.rightStatement}
                          </p>
                        </div>
                        
                        <SafeCardDescription className="text-sm leading-relaxed">
                          {law.summary}
                        </SafeCardDescription>

                        <Dialog>
                          <DialogTrigger asChild>
                            <SafeButton variant="outline" size="sm" className="w-full">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Read More Details
                            </SafeButton>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <Scale className="h-5 w-5 text-accent" />
                                <span>{law.title}</span>
                              </DialogTitle>
                              <DialogDescription>
                                {law.rightStatement}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <ScrollArea className="max-h-96 pr-4">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Overview</h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {law.detailedInfo}
                                  </p>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-3">Your Rights Include:</h4>
                                  <ul className="space-y-2">
                                    {law.sections.map((section, index) => (
                                      <li key={index} className="flex items-start space-x-2 text-sm">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <span className="text-muted-foreground leading-relaxed">
                                          {section}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="bg-accent-soft p-4 rounded-lg">
                                  <p className="text-sm text-accent">
                                    <strong>Remember:</strong> These are your fundamental rights. 
                                    If you need help exercising these rights, contact legal aid 
                                    services or the helplines listed in the Emergency section.
                                  </p>
                                </div>
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </SafeCardContent>
                  </SafeCard>
                ))
              )}
            </div>

            {/* Bookmarked Laws Section */}
            {bookmarkedLaws.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BookmarkCheck className="h-5 w-5 mr-2 text-primary" />
                  Bookmarked Laws ({bookmarkedLaws.length})
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your saved laws are available for offline reading
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default HelpCentre
