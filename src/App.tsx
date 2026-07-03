import {
  ArrowRight,
  Bot,
  Building2,
  CalendarDays,
  Check,
  ClipboardCheck,
  ExternalLink,
  Home,
  KeyRound,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import './App.css'

type StepKey =
  | 'budget'
  | 'moveIn'
  | 'location'
  | 'stay'
  | 'lifestyle'
  | 'facilities'

type LeadPrefs = Partial<Record<StepKey, string>>

type Message = {
  id: string
  from: 'kai' | 'customer'
  text: string
}

type Step = {
  key: StepKey
  label: string
  prompt: string
  icon: typeof Wallet
  options: string[]
}

type Property = {
  id: string
  name: string
  neighborhood: string
  weekly: number
  availableInDays: number
  minStayMonths: number
  roomType: string
  image: string
  facilities: string[]
  tags: string[]
  accent: string
}

const steps: Step[] = [
  {
    key: 'budget',
    label: 'Budget',
    prompt: "What's your weekly budget range?",
    icon: Wallet,
    options: ['Under $300/wk', '$300-380/wk', '$380-480/wk', 'Flexible'],
  },
  {
    key: 'moveIn',
    label: 'Move-in',
    prompt: 'When do you want to move in?',
    icon: CalendarDays,
    options: ['This week', 'In 2 weeks', 'Next month', 'Not sure yet'],
  },
  {
    key: 'location',
    label: 'Location',
    prompt: 'Which area should Kai prioritise?',
    icon: MapPin,
    options: ['CBD / RMIT', 'UniMelb', 'Carlton', 'Near tram', 'Flexible'],
  },
  {
    key: 'stay',
    label: 'Stay length',
    prompt: 'How long are you planning to stay?',
    icon: Home,
    options: ['3 months', '6 months', '12 months', 'Not sure yet'],
  },
  {
    key: 'lifestyle',
    label: 'Lifestyle',
    prompt: 'What kind of living environment fits you best?',
    icon: SlidersHorizontal,
    options: ['Quiet', 'Social', 'Study-focused', 'Work from home'],
  },
  {
    key: 'facilities',
    label: 'Facilities',
    prompt: 'Any facility that matters most?',
    icon: Building2,
    options: [
      'Private bathroom',
      'Furnished',
      'Bills included',
      'Gym nearby',
      'No strong preference',
    ],
  },
]

const properties: Property[] = [
  {
    id: 'swanston-studio',
    name: 'Swanston Central Studio',
    neighborhood: 'CBD / RMIT',
    weekly: 455,
    availableInDays: 5,
    minStayMonths: 6,
    roomType: 'Private studio',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    facilities: ['Furnished', 'Private bathroom', 'Bills included'],
    tags: ['Study-focused', 'Work from home', 'Near tram'],
    accent: '#f36f45',
  },
  {
    id: 'carlton-share',
    name: 'Carlton Student Share',
    neighborhood: 'Carlton / UniMelb',
    weekly: 335,
    availableInDays: 12,
    minStayMonths: 3,
    roomType: 'Private room',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    facilities: ['Furnished', 'Bills included', 'Laundry'],
    tags: ['Social', 'Study-focused', 'UniMelb'],
    accent: '#1d8f79',
  },
  {
    id: 'north-melbourne',
    name: 'North Melbourne Ensuite',
    neighborhood: 'North Melbourne',
    weekly: 405,
    availableInDays: 20,
    minStayMonths: 6,
    roomType: 'Ensuite room',
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
    facilities: ['Private bathroom', 'Furnished', 'Gym nearby'],
    tags: ['Quiet', 'Work from home', 'Near tram'],
    accent: '#d2a522',
  },
  {
    id: 'docklands-apartment',
    name: 'Docklands Riverside Room',
    neighborhood: 'Docklands',
    weekly: 385,
    availableInDays: 30,
    minStayMonths: 12,
    roomType: 'Private room',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    facilities: ['Furnished', 'Gym nearby', 'Bills included'],
    tags: ['Quiet', 'Work from home', 'Near tram'],
    accent: '#4f70a7',
  },
]

const sourceLabels: Record<string, string> = {
  homepage: 'RoomingKos homepage',
  'roomingkos-site': 'RoomingKos website',
  'site-preview': 'RoomingKos site preview',
  'swanston-page': 'Swanston property page',
  'student-housing': 'Student housing campaign',
}

function getSourceLabel() {
  const params = new URLSearchParams(window.location.search)
  const source = params.get('source') ?? 'roomingkos-site'
  return sourceLabels[source] ?? source.replace(/[-_]/g, ' ')
}

function isSitePreview() {
  return new URLSearchParams(window.location.search).get('view') === 'site'
}

function budgetRange(answer?: string) {
  if (!answer) return null
  if (answer.includes('Under')) return { min: 0, max: 300 }
  if (answer.includes('300-380')) return { min: 300, max: 380 }
  if (answer.includes('380-480')) return { min: 380, max: 480 }
  return { min: 0, max: 600 }
}

function requestedMoveInDays(answer?: string) {
  if (!answer) return null
  if (answer === 'This week') return 7
  if (answer === 'In 2 weeks') return 14
  if (answer === 'Next month') return 31
  return 45
}

function requestedStayMonths(answer?: string) {
  if (!answer) return null
  if (answer === '3 months') return 3
  if (answer === '6 months') return 6
  if (answer === '12 months') return 12
  return 6
}

function scoreProperty(property: Property, prefs: LeadPrefs) {
  let score = 58

  const budget = budgetRange(prefs.budget)
  if (budget) {
    if (property.weekly >= budget.min && property.weekly <= budget.max) {
      score += 18
    } else if (property.weekly <= budget.max + 45) {
      score += 8
    } else {
      score -= 14
    }
  }

  const moveInDays = requestedMoveInDays(prefs.moveIn)
  if (moveInDays) {
    score += property.availableInDays <= moveInDays ? 12 : -4
  }

  if (prefs.location && prefs.location !== 'Flexible') {
    const target = prefs.location.toLowerCase()
    const searchable = `${property.neighborhood} ${property.tags.join(' ')}`.toLowerCase()
    score += searchable.includes(target.split(' / ')[0]) ? 14 : -3
  }

  const stayMonths = requestedStayMonths(prefs.stay)
  if (stayMonths) {
    score += property.minStayMonths <= stayMonths ? 10 : -6
  }

  if (prefs.lifestyle) {
    score += property.tags.includes(prefs.lifestyle) ? 10 : 0
  }

  if (prefs.facilities && prefs.facilities !== 'No strong preference') {
    score += property.facilities.includes(prefs.facilities) ? 10 : -2
  }

  return Math.max(42, Math.min(98, score))
}

function matchReasons(property: Property, prefs: LeadPrefs) {
  const reasons: string[] = []

  const budget = budgetRange(prefs.budget)
  if (budget && property.weekly >= budget.min && property.weekly <= budget.max) {
    reasons.push(`fits the ${prefs.budget} budget band`)
  }

  const moveInDays = requestedMoveInDays(prefs.moveIn)
  if (moveInDays && property.availableInDays <= moveInDays) {
    reasons.push(`available within ${prefs.moveIn?.toLowerCase()}`)
  }

  if (prefs.location && property.neighborhood.includes(prefs.location.split(' / ')[0])) {
    reasons.push(`matches the ${prefs.location} location preference`)
  }

  if (prefs.lifestyle && property.tags.includes(prefs.lifestyle)) {
    reasons.push(`supports a ${prefs.lifestyle.toLowerCase()} lifestyle`)
  }

  if (prefs.facilities && property.facilities.includes(prefs.facilities)) {
    reasons.push(`includes ${prefs.facilities.toLowerCase()}`)
  }

  if (reasons.length === 0) {
    return ['keeps the search close to the strongest available RoomingKos options']
  }

  return reasons.slice(0, 2)
}

function shortValue(value?: string) {
  return value ?? 'Not captured'
}

function RoomingKosSitePreview() {
  const kaiUrl = '?source=site-preview&from=homepage-toggle'

  return (
    <main className="site-preview">
      <header className="site-preview-nav">
        <div className="brand-lockup">
          <div className="brand-mark">RK</div>
          <div>
            <p className="eyebrow">RoomingKos company website</p>
            <strong>RoomingKos</strong>
          </div>
        </div>
        <nav aria-label="Demo website navigation">
          <a href="#rooms">Rooms</a>
          <a href="#locations">Locations</a>
          <a href="#support">Support</a>
        </nav>
      </header>

      <section className="site-hero">
        <div className="site-hero-copy">
          <p className="eyebrow">Student housing in Melbourne</p>
          <h1>Rooms that fit your budget, move-in date and lifestyle.</h1>
          <p>
            Tell Kai what matters most, then get a short list of room options
            with clear next steps for inspection and staff follow-up.
          </p>
          <div className="site-hero-actions">
            <a className="primary-link" href={kaiUrl}>
              <Bot size={18} />
              Ask Kai to match a room
            </a>
            <a className="secondary-link" href="#rooms">
              View sample rooms
            </a>
          </div>
        </div>

        <div className="site-hero-visual" aria-label="Featured RoomingKos room">
          <img src={properties[0].image} alt="RoomingKos featured studio" />
          <div className="site-floating-card">
            <span>Available in 5 days</span>
            <strong>Swanston Central Studio</strong>
            <small>$455/wk · CBD / RMIT</small>
          </div>
        </div>
      </section>

      <section className="site-proof-grid" id="support" aria-label="RoomingKos service highlights">
        <article>
          <Search size={22} />
          <h2>Search faster</h2>
          <p>Visitors can start from budget, area, move-in timing or facilities.</p>
        </article>
        <article>
          <KeyRound size={22} />
          <h2>Convert enquiries</h2>
          <p>Kai turns browsing into a structured lead and inspection-ready brief.</p>
        </article>
        <article>
          <ShieldCheck size={22} />
          <h2>Keep staff in control</h2>
          <p>Recommendations stay explainable and hand off to the RoomingKos team.</p>
        </article>
      </section>

      <section className="site-room-strip" id="rooms" aria-label="Sample rooms">
        {properties.slice(0, 3).map((property) => (
          <article key={property.id}>
            <img src={property.image} alt={`${property.name} interior`} />
            <div>
              <strong>{property.name}</strong>
              <span>
                {property.neighborhood} · ${property.weekly}/wk
              </span>
            </div>
          </article>
        ))}
      </section>

      <a className="kai-site-toggle" href={kaiUrl} aria-label="Open Kai room matching assistant">
        <span>K</span>
        <strong>
          Ask Kai
          <small>AI room matching</small>
        </strong>
      </a>
    </main>
  )
}

function KaiApp() {
  const sourceLabel = useMemo(() => getSourceLabel(), [])
  const [prefs, setPrefs] = useState<LeadPrefs>({})
  const [customAnswer, setCustomAnswer] = useState('')
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0].id)
  const [copied, setCopied] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-0',
      from: 'kai',
      text: `Hi, I'm Kai. I can help narrow RoomingKos options from your budget, move-in timing, location and lifestyle. I can see you came from ${sourceLabel}.`,
    },
    {
      id: 'm-1',
      from: 'kai',
      text: steps[0].prompt,
    },
  ])

  const activeStep = steps.find((step) => !prefs[step.key])
  const completedSteps = steps.filter((step) => prefs[step.key]).length
  const progress = Math.round((completedSteps / steps.length) * 100)
  const recommendations = useMemo(
    () =>
      properties
        .map((property) => ({
          ...property,
          score: scoreProperty(property, prefs),
          reasons: matchReasons(property, prefs),
        }))
        .sort((a, b) => b.score - a.score),
    [prefs],
  )
  const selectedProperty =
    recommendations.find((property) => property.id === selectedPropertyId) ??
    recommendations[0]

  const handoffText = [
    'Kai lead handoff',
    `Source: ${sourceLabel}`,
    `Budget: ${shortValue(prefs.budget)}`,
    `Move-in: ${shortValue(prefs.moveIn)}`,
    `Location: ${shortValue(prefs.location)}`,
    `Stay length: ${shortValue(prefs.stay)}`,
    `Lifestyle: ${shortValue(prefs.lifestyle)}`,
    `Facility priority: ${shortValue(prefs.facilities)}`,
    `Top match: ${recommendations[0].name}, $${recommendations[0].weekly}/wk, ${recommendations[0].score}% fit`,
  ].join('\n')

  function answerCurrentStep(answer: string) {
    if (!activeStep) return

    const nextPrefs = { ...prefs, [activeStep.key]: answer }
    const nextStep = steps.find((step) => !nextPrefs[step.key])
    const userMessage: Message = {
      id: `m-${Date.now()}-u`,
      from: 'customer',
      text: answer,
    }
    const kaiMessage: Message = {
      id: `m-${Date.now()}-k`,
      from: 'kai',
      text: nextStep
        ? nextStep.prompt
        : 'I have enough to rank the strongest options. Here are the best matches and what I would hand over to the RoomingKos team.',
    }

    setPrefs(nextPrefs)
    setMessages((current) => [...current, userMessage, kaiMessage])
    setCustomAnswer('')
  }

  function submitCustomAnswer() {
    const answer = customAnswer.trim()
    if (!answer) return
    answerCurrentStep(answer)
  }

  async function copyHandoff() {
    try {
      await navigator.clipboard?.writeText(handoffText)
    } catch {
      // Browser previews can deny clipboard access; the handoff still remains visible.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  function requestInspection(propertyName: string) {
    setMessages((current) => [
      ...current,
      {
        id: `m-${Date.now()}-u`,
        from: 'customer',
        text: `I want to inspect ${propertyName}.`,
      },
      {
        id: `m-${Date.now()}-k`,
        from: 'kai',
        text: `Great. I would send ${propertyName} with your lead brief to the RoomingKos team so they can confirm availability and inspection times.`,
      },
    ])
  }

  return (
    <main className="app-shell">
      <section className="topbar" aria-label="Kai header">
        <div className="brand-lockup">
          <div className="brand-mark">RK</div>
          <div>
            <p className="eyebrow">RoomingKos Sales AI Agent</p>
            <h1>Kai</h1>
          </div>
        </div>
        <a className="site-link" href="?view=site">
          <ExternalLink size={18} />
          Preview site toggle
        </a>
      </section>

      <section className="workspace">
        <section className="conversation-panel" aria-label="Kai conversation">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Live consultation</p>
              <h2>Find the best room fit</h2>
            </div>
            <div className="agent-pill">
              <Bot size={18} />
              Kai active
            </div>
          </div>

          <div className="progress-track" aria-label={`${progress}% complete`}>
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="messages">
            {messages.map((message) => (
              <article className={`message ${message.from}`} key={message.id}>
                <div className="message-avatar">
                  {message.from === 'kai' ? <Bot size={17} /> : <MessageSquareText size={17} />}
                </div>
                <p>{message.text}</p>
              </article>
            ))}
          </div>

          {activeStep ? (
            <div className="answer-dock">
              <div className="step-label">
                <activeStep.icon size={17} />
                {activeStep.label}
              </div>
              <div className="quick-replies">
                {activeStep.options.map((option) => (
                  <button type="button" onClick={() => answerCurrentStep(option)} key={option}>
                    {option}
                  </button>
                ))}
              </div>
              <div className="free-answer">
                <input
                  value={customAnswer}
                  onChange={(event) => setCustomAnswer(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') submitCustomAnswer()
                  }}
                  placeholder="Type another answer"
                />
                <button type="button" onClick={submitCustomAnswer} aria-label="Send answer">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="conversion-dock">
              <div>
                <p className="eyebrow">Next action</p>
                <strong>Send lead brief to RoomingKos staff</strong>
              </div>
              <button type="button" onClick={copyHandoff}>
                {copied ? <Check size={18} /> : <ClipboardCheck size={18} />}
                {copied ? 'Copied' : 'Copy brief'}
              </button>
            </div>
          )}
        </section>

        <aside className="lead-panel" aria-label="Lead profile">
          <div className="source-card">
            <p className="eyebrow">Entry point</p>
            <strong>{sourceLabel}</strong>
            <span>Referral context follows the lead into Kai.</span>
          </div>

          <div className="lead-grid">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div className="lead-item" key={step.key}>
                  <Icon size={18} />
                  <span>{step.label}</span>
                  <strong>{shortValue(prefs[step.key])}</strong>
                </div>
              )
            })}
          </div>

          <div className="handoff-card">
            <div className="handoff-header">
              <ClipboardCheck size={18} />
              <strong>Staff handoff</strong>
            </div>
            <pre>{handoffText}</pre>
          </div>
        </aside>
      </section>

      <section className="recommendations" aria-label="Property recommendations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Kai recommendation set</p>
            <h2>Ranked RoomingKos options</h2>
          </div>
          <span>{recommendations[0].score}% top fit</span>
        </div>

        <div className="property-layout">
          <div className="property-list">
            {recommendations.slice(0, 3).map((property) => (
              <article className="property-card" key={property.id}>
                <div className="property-image">
                  <img src={property.image} alt={`${property.name} interior`} />
                  <span style={{ background: property.accent }}>{property.score}% fit</span>
                </div>
                <div className="property-body">
                  <div>
                    <h3>{property.name}</h3>
                    <p>
                      {property.neighborhood} · ${property.weekly}/wk · available in{' '}
                      {property.availableInDays} days
                    </p>
                  </div>
                  <ul>
                    {property.reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                  <div className="card-actions">
                    <button type="button" onClick={() => setSelectedPropertyId(property.id)}>
                      Compare
                    </button>
                    <button type="button" onClick={() => requestInspection(property.name)}>
                      <Phone size={16} />
                      Inspect
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="compare-panel">
            <div className="compare-image">
              <img src={selectedProperty.image} alt={`${selectedProperty.name} detail`} />
            </div>
            <p className="eyebrow">Selected comparison</p>
            <h3>{selectedProperty.name}</h3>
            <dl>
              <div>
                <dt>Weekly rent</dt>
                <dd>${selectedProperty.weekly}</dd>
              </div>
              <div>
                <dt>Room type</dt>
                <dd>{selectedProperty.roomType}</dd>
              </div>
              <div>
                <dt>Minimum stay</dt>
                <dd>{selectedProperty.minStayMonths} months</dd>
              </div>
              <div>
                <dt>Facilities</dt>
                <dd>{selectedProperty.facilities.join(', ')}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  )
}

function App() {
  return isSitePreview() ? <RoomingKosSitePreview /> : <KaiApp />
}

export default App
