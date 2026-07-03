import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Building2,
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock3,
  Database,
  ExternalLink,
  FileCheck2,
  Home,
  KeyRound,
  LineChart,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  roomingKosCatalog,
} from './data/roomingkosCatalog.ts'
import {
  buildHandoffText,
  catalogAudit,
  catalogStats,
  defaultCatalogSort,
  getSourceLabelFromSearch,
  isSitePreviewFromSearch,
  leadReadinessScore,
  locationLabel,
  money,
  priceLabel,
  readinessLabel,
  recommendationsFor,
  roomTypeCountLabel,
  roomTypeSummary,
  shortValue,
  statusAccent,
  type LeadPrefs,
  type StepKey,
} from './kaiLogic.ts'
import './App.css'

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

function MetricTile({
  icon: Icon,
  value,
  label,
  caption,
}: {
  icon: typeof Wallet
  value: string
  label: string
  caption: string
}) {
  return (
    <article className="metric-tile">
      <Icon size={19} />
      <strong>{value}</strong>
      <span>{label}</span>
      <small>{caption}</small>
    </article>
  )
}

function RoomingKosSitePreview() {
  const kaiUrl = '?source=site-preview&from=homepage-toggle'
  const siteOptions = [...roomingKosCatalog]
    .sort(defaultCatalogSort)
    .filter((option) => option.status === 'Available')
    .slice(0, 3)
  const heroOption = siteOptions[0] ?? roomingKosCatalog[0]
  const proofCards = [
    {
      icon: Search,
      title: 'Search the live catalog',
      text: `${catalogStats.total} public listings, ${catalogStats.groupCounts.building} buildings and ${catalogStats.groupCounts.rooming_house} rooming houses.`,
    },
    {
      icon: Zap,
      title: 'Convert anonymous visitors',
      text: 'Kai collects budget, timing, location and lifestyle before staff spend time on the lead.',
    },
    {
      icon: ShieldCheck,
      title: 'Keep staff in control',
      text: `${catalogAudit.starRezRows} public StarRez entry rows stay as provenance, not automated submissions.`,
    },
  ]

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
          <p className="eyebrow">Sales AI entrypoint</p>
          <h1>Match rooms, capture intent, hand off cleanly.</h1>
          <p>
            Kai turns RoomingKos browsing into an explainable shortlist and a staff-ready
            sales brief using the verified public catalog.
          </p>
          <div className="site-hero-actions">
            <a className="primary-link" href={kaiUrl}>
              <Bot size={18} />
              Ask Kai to match a room
            </a>
            <a className="secondary-link" href="#rooms">
              View current options
            </a>
          </div>
        </div>

        <div className="site-hero-visual" aria-label="Featured RoomingKos room">
          <img src={heroOption.imageUrl} alt={`${heroOption.displayName} RoomingKos listing`} />
          <div className="site-floating-card">
            <span>{heroOption.status}</span>
            <strong>{heroOption.displayName}</strong>
            <small>
              {priceLabel(heroOption)} · {locationLabel(heroOption)}
            </small>
          </div>
        </div>
      </section>

      <section className="site-proof-grid" id="support" aria-label="RoomingKos service highlights">
        {proofCards.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.title}>
              <Icon size={22} />
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </article>
          )
        })}
      </section>

      <section className="site-room-strip" id="rooms" aria-label="RoomingKos options">
        {siteOptions.map((option) => (
          <article key={option.id}>
            <img src={option.imageUrl} alt={`${option.displayName} listing`} />
            <div>
              <strong>{option.displayName}</strong>
              <span>
                {option.status} · {priceLabel(option)}
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
  const sourceLabel = useMemo(() => getSourceLabelFromSearch(window.location.search), [])
  const [prefs, setPrefs] = useState<LeadPrefs>({})
  const [customAnswer, setCustomAnswer] = useState('')
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    [...roomingKosCatalog].sort(defaultCatalogSort)[0].id,
  )
  const [requestedInspectionId, setRequestedInspectionId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-0',
      from: 'kai',
      text: `Hi, I'm Kai. I rank RoomingKos options from verified public listings and turn this chat into a staff handoff. I can see you came from ${sourceLabel}.`,
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
  const recommendations = useMemo(() => recommendationsFor(prefs), [prefs])
  const topMatches = recommendations.slice(0, 3)
  const selectedProperty =
    recommendations.find((option) => option.id === selectedPropertyId) ??
    recommendations[0]
  const requestedInspection =
    requestedInspectionId === null
      ? null
      : recommendations.find((option) => option.id === requestedInspectionId) ?? null
  const conversionReadiness = leadReadinessScore({
    completedSteps,
    topMatch: topMatches[0],
    moveInCaptured: Boolean(prefs.moveIn),
  })
  const priceMin = Math.min(...catalogStats.pricePoints)
  const priceMax = Math.max(...catalogStats.pricePoints)

  const handoffText = buildHandoffText({
    sourceLabel,
    prefs,
    topMatches,
    conversionReadiness,
    requestedInspection,
  })

  useEffect(() => {
    if (recommendations[0]) {
      setSelectedPropertyId(recommendations[0].id)
    }
  }, [recommendations])

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
        : 'I have enough to rank the strongest options. Here are the best matches and the handoff I would send to the RoomingKos team.',
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

  function requestInspection(optionId: string) {
    const option = recommendations.find((item) => item.id === optionId)
    if (!option) return

    setSelectedPropertyId(option.id)
    setRequestedInspectionId(option.id)
    setMessages((current) => [
      ...current,
      {
        id: `m-${Date.now()}-u`,
        from: 'customer',
        text: `I want to inspect ${option.displayName}.`,
      },
      {
        id: `m-${Date.now()}-k`,
        from: 'kai',
        text: `Great. I would add ${option.displayName} as the requested inspection in the staff brief so the RoomingKos team can confirm availability, waitlist or inspection times.`,
      },
    ])
  }

  const heroMetrics = [
    {
      icon: Database,
      value: `${catalogStats.total}`,
      label: 'verified listings',
      caption: `${catalogStats.groupCounts.building} buildings + ${catalogStats.groupCounts.rooming_house} houses`,
    },
    {
      icon: BarChart3,
      value: `${catalogStats.statusCounts.Available}`,
      label: 'available options',
      caption: `${catalogStats.statusCounts.Waitlist} waitlist backups`,
    },
    {
      icon: FileCheck2,
      value: `${catalogStats.roomTypeCount}`,
      label: 'clean room types',
      caption: `${catalogAudit.sourceRoomRows} source rows checked`,
    },
    {
      icon: KeyRound,
      value: `$${money(priceMin)}-$${money(priceMax)}`,
      label: 'weekly price span',
      caption: `${catalogStats.applyUrlCount} public apply links`,
    },
  ]

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
        <div className="topbar-actions">
          <div className="audit-badge">
            <BadgeCheck size={18} />
            {catalogAudit.verificationResult} public-data audit
          </div>
          <a className="site-link" href="?view=site">
            <ExternalLink size={18} />
            Preview site toggle
          </a>
        </div>
      </section>

      <section className="command-hero" aria-label="Kai operating summary">
        <div className="command-copy">
          <p className="eyebrow">Lead conversion cockpit</p>
          <h2>From browsing signal to inspection-ready handoff.</h2>
          <p>
            Kai qualifies the prospect, ranks real RoomingKos stock, exposes the evidence,
            and prepares a concise staff brief without pretending to submit applications.
          </p>
        </div>
        <div className="hero-metrics" aria-label="Catalog audit metrics">
          {heroMetrics.map((metric) => (
            <MetricTile key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="workspace">
        <section className="conversation-panel" aria-label="Kai conversation">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Live consultation</p>
              <h2>Qualify the lead</h2>
              <span>Budget, timing, location, stay length, lifestyle and facilities.</span>
            </div>
            <div className="agent-pill">
              <Sparkles size={18} />
              Kai active
            </div>
          </div>

          <div className="progress-shell">
            <div>
              <strong>{progress}%</strong>
              <span>{completedSteps} of {steps.length} signals captured</span>
            </div>
            <div className="progress-track" aria-label={`${progress}% complete`}>
              <span style={{ width: `${progress}%` }} />
            </div>
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
                <span>{activeStep.label}</span>
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
                <span>{readinessLabel(conversionReadiness)} at {conversionReadiness}% readiness</span>
              </div>
              <button type="button" onClick={copyHandoff}>
                {copied ? <Check size={18} /> : <ClipboardCheck size={18} />}
                {copied ? 'Copied' : 'Copy brief'}
              </button>
            </div>
          )}
        </section>

        <aside className="lead-panel" aria-label="Lead profile and data evidence">
          <div className="deal-card">
            <div>
              <p className="eyebrow">Conversion readiness</p>
              <strong>{conversionReadiness}%</strong>
              <span>{readinessLabel(conversionReadiness)}</span>
            </div>
            <TrendingUp size={26} />
          </div>

          <div className="source-card">
            <p className="eyebrow">Entry point</p>
            <strong>{sourceLabel}</strong>
            <span>Referral context follows the lead into Kai and the staff brief.</span>
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

          <div className="data-card">
            <div className="data-card-head">
              <Database size={18} />
              <strong>Evidence spine</strong>
            </div>
            <dl>
              <div>
                <dt>Generated</dt>
                <dd>{catalogAudit.catalogGeneratedAt}</dd>
              </div>
              <div>
                <dt>Coverage</dt>
                <dd>{catalogStats.sourceUrlCount}/{catalogStats.total} source URLs</dd>
              </div>
              <div>
                <dt>Safety</dt>
                <dd>No login, upload, payment or application submission.</dd>
              </div>
            </dl>
          </div>

          <div className="handoff-card">
            <div className="handoff-header">
              <Send size={18} />
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
          <span>
            <Target size={17} />
            {topMatches[0].score}% top fit
          </span>
        </div>

        <div className="data-rail" aria-label="Recommendation data quality">
          <div>
            <Clock3 size={18} />
            <span>Scrape verified {catalogAudit.publicScrapeVerifiedAt}</span>
          </div>
          <div>
            <FileCheck2 size={18} />
            <span>{catalogStats.withRoomTypes} listings include room-type rows</span>
          </div>
          <div>
            <LineChart size={18} />
            <span>Scores update from every captured answer</span>
          </div>
        </div>

        <div className="property-layout">
          <div className="property-list">
            {topMatches.map((option) => (
              <article className="property-card" key={option.id}>
                <div className="property-image">
                  <img src={option.imageUrl} alt={`${option.displayName} listing`} />
                  <span style={{ background: statusAccent(option) }}>{option.score}% fit</span>
                </div>
                <div className="property-body">
                  <div>
                    <div className="option-badges">
                      <span className={`status-badge ${option.status.toLowerCase().replaceAll(' ', '-')}`}>
                        {option.status}
                      </span>
                      {option.group === 'rooming_house' ? (
                        <span className="group-badge">Rooming house</span>
                      ) : (
                        <span className="group-badge">Named building</span>
                      )}
                    </div>
                    <h3>{option.displayName}</h3>
                    <p>{`${locationLabel(option)} · ${priceLabel(option)} · ${roomTypeCountLabel(option)}`}</p>
                  </div>
                  <ul>
                    {option.reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                  <div className="source-mini">
                    <FileCheck2 size={15} />
                    <span>Public listing evidence attached</span>
                  </div>
                  <div className="card-actions">
                    <button type="button" onClick={() => setSelectedPropertyId(option.id)}>
                      Compare
                    </button>
                    <button type="button" onClick={() => requestInspection(option.id)}>
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
              <img src={selectedProperty.imageUrl} alt={`${selectedProperty.displayName} detail`} />
            </div>
            <div className="compare-copy">
              <p className="eyebrow">Selected comparison</p>
              <h3>{selectedProperty.displayName}</h3>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{selectedProperty.status}</dd>
                </div>
                <div>
                  <dt>Weekly from</dt>
                  <dd>{priceLabel(selectedProperty)}</dd>
                </div>
                <div>
                  <dt>Room types</dt>
                  <dd>{roomTypeSummary(selectedProperty)}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{locationLabel(selectedProperty)}</dd>
                </div>
                <div>
                  <dt>Public source</dt>
                  <dd>
                    <a href={selectedProperty.sourceUrl} target="_blank" rel="noreferrer">
                      Open listing
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Apply link</dt>
                  <dd>
                    {selectedProperty.applyUrl ? (
                      <a href={selectedProperty.applyUrl} target="_blank" rel="noreferrer">
                        Open entrypoint
                      </a>
                    ) : (
                      'Not published'
                    )}
                  </dd>
                </div>
              </dl>
              <div className="evidence-notes">
                <strong>Catalog notes</strong>
                <ul>
                  {selectedProperty.matchNotes.slice(0, 3).map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

function App() {
  return isSitePreviewFromSearch(window.location.search) ? <RoomingKosSitePreview /> : <KaiApp />
}

export default App
