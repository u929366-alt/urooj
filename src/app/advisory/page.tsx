import type { Metadata } from "next";
import Image from "next/image";
import {
  Landmark,
  FlaskConical,
  DraftingCompass,
  LineChart,
  Building2,
  Network,
  Lightbulb,
  Compass,
  PencilRuler,
  Repeat,
  ShieldCheck,
  Users,
  HandHeart,
  Scale,
  Database,
  HeartPulse,
  GraduationCap,
  CloudSunRain,
  CheckCircle2,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export const metadata: Metadata = {
  title: "Policy, Research, and Institutional Advisory",
  description:
    "The Policy, Research, and Institutional Advisory Platform at Hunar Saaz bridges the gap between evidence, public decision-making, and implementation — supporting governments, development partners, and public and private institutions across Pakistan's social sector.",
};

const challenges = [
  {
    title: "Limited use of evidence",
    description:
      "Data, research, and monitoring outputs are frequently produced as compliance requirements rather than as tools for learning, course correction, and strategic choice — leaving policies shaped by precedent and short-term pressures.",
  },
  {
    title: "Fragmented programming",
    description:
      "Multiple actors operate in parallel, with overlapping mandates, disconnected interventions, and limited coordination across federal, provincial, and local levels — diluting impact and weakening accountability for results.",
  },
  {
    title: "Institutional capacity gaps",
    description:
      "Institutions face real constraints in translating complex policy goals into implementable designs, adaptive delivery models, and decision-useful monitoring systems. Capacity efforts are often generic, episodic, and poorly embedded.",
  },
];

const principles = [
  {
    icon: Network,
    title: "Systems, not silos",
    description:
      "Social sector work is a system challenge. Policies, programmes, institutions, incentives, and political realities interact — sustainable results emerge only when they are addressed together.",
  },
  {
    icon: Lightbulb,
    title: "Evidence that serves decisions",
    description:
      "Evidence-informed, but never evidence for its own sake. We prioritize analysis that is decision-relevant, context-specific, and proportionate to institutional capacity.",
  },
  {
    icon: Compass,
    title: "Contextual intelligence",
    description:
      "Social, political, administrative, and fiscal realities shape what is feasible. Effective solutions are designed around these constraints, not idealized conditions.",
  },
  {
    icon: PencilRuler,
    title: "Good design precedes good delivery",
    description:
      "Policies and programmes must be realistic, internally coherent, and aligned with institutional roles and incentives. Where design is weak, even well-resourced interventions struggle.",
  },
  {
    icon: Repeat,
    title: "Capacity is built through practice",
    description:
      "Institutional strengthening works best when embedded within real work processes — planning cycles, implementation decisions, monitoring routines — so learning occurs through doing.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity and responsible engagement",
    description:
      "We adhere to do-no-harm principles, remain attentive to power dynamics, and respect institutional ownership. Our role is to strengthen institutions, never to substitute for them.",
  },
];

const services = [
  {
    icon: Landmark,
    title: "Policy, Strategy, and Systems Advisory",
    description:
      "Translating policy priorities into coherent strategies and operational frameworks — policy analysis, strategic planning, reform design, and alignment of mandates, incentives, and delivery mechanisms across levels of government.",
  },
  {
    icon: FlaskConical,
    title: "Research, Evidence, and Learning",
    description:
      "Applied research and analytical work designed to inform real decisions — generating and synthesizing evidence for policy choices, programme design, and course correction, in outputs that are timely, relevant, and usable.",
  },
  {
    icon: DraftingCompass,
    title: "Programme Design and Delivery Support",
    description:
      "Programmes that are realistic, context-sensitive, and implementable — theory of change development, results frameworks, operational guidelines, and adaptive delivery models grounded in on-ground realities.",
  },
  {
    icon: LineChart,
    title: "Monitoring, Evaluation, and Adaptive Learning",
    description:
      "M&E that emphasizes learning and accountability over compliance — systems for ongoing performance review, feedback loops, and evidence-based adaptation, helping institutions move from reporting to informed action.",
  },
  {
    icon: Building2,
    title: "Institutional and Capacity Strengthening",
    description:
      "Embedded, practice-based institutional strengthening — working alongside teams to improve planning, implementation, and review functions within existing institutional processes, not isolated training events.",
  },
];

const engagementPrinciples = [
  {
    title: "A thought partner, not a contractor",
    description:
      "We engage as a technical ally invested in institutional ownership, coherence, and long-term capability — not an external contractor operating at arm's length.",
  },
  {
    title: "Co-creation and collaboration",
    description:
      "From problem definition through design and implementation support, we work closely with counterparts so solutions reflect institutional priorities, constraints, and political economy considerations.",
  },
  {
    title: "Embedded and iterative",
    description:
      "Reforms rarely follow linear pathways. We support institutions through cycles of design, implementation, review, and adaptation as conditions evolve.",
  },
  {
    title: "Decision-useful outputs",
    description:
      "Whether analytical work, strategies, tools, or frameworks — our focus is clarity, relevance, and usability, so outputs inform concrete decisions rather than satisfy procedural requirements.",
  },
];

const associates: {
  name: string;
  role: string;
  bio: string;
  photo?: string;
}[] = [
  {
    name: "Waqar Sherazi",
    role: "Senior Associate | Policy, Research, and Evaluation",
    photo: "/team/waqar-sherazi.jpg",
    bio: "A policy, research, and evaluation specialist with nearly two decades of experience at the intersection of social protection, gender equality, WASH, climate resilience, and institutional reform. He has led complex national and international assignments for governments, multilateral agencies, and development partners across Pakistan, South Asia, the Middle East, and Africa — spanning large-scale programme design, digital censuses and registries, quasi-experimental and mixed-methods evaluations, and national policy reporting including Pakistan's reporting under CEDAW and BPfA+30. At Hunar Saaz, he provides strategic leadership on evidence-informed policy design, evaluation quality, and learning systems.",
  },
  {
    name: "Ahsan Ali Mangi",
    role: "Senior Associate | Public Policy, Governance, and Institutional Systems",
    photo: "/team/ahsan-ali-mangi.jpg",
    bio: "Over three decades of senior public sector leadership across federal and provincial governments, including positions as Federal Secretary, Additional Secretary, Commissioner, and head of major public institutions — with responsibilities spanning economic governance, trade diplomacy, education, social protection, disaster response, investment promotion, and regulatory reform. He has represented Pakistan in multilateral settings and led complex negotiations and administrative systems. At Hunar Saaz, he anchors work on governance reform, public sector systems, and institutional effectiveness.",
  },
  {
    name: "Rana Iftikhar Raza",
    role: "Senior Associate | Data Systems, EMIS, and Digital Governance",
    bio: "A senior data systems and digital governance specialist with over thirty years of experience in Education Management Information Systems (EMIS), GIS-based planning, large-scale surveys, and public sector information systems. He has played a foundational role in the design, digitization, and institutionalization of EMIS and decision-support systems across multiple provinces, with expertise spanning system architecture, spatial data integration, survey operations, third-party validations, and capacity building. At Hunar Saaz, he leads work on data systems, digital transformation, and evidence infrastructure.",
  },
  {
    name: "Urooj Shafi",
    role: "Associate | Public Sector Finance | Research & Trade",
    photo: "/team/urooj-shafi.jpg",
    bio: "A public sector finance and policy professional with 13+ years of experience spanning trade, market regulation, fair trade enforcement, monitoring & evaluation, and sovereign financial analysis. She has produced sectoral research across engineering, minerals, agriculture, and textiles — analyzing tariff structures, comparative country policy, and macroeconomic indicators — translating that work into briefs that reached senior policymakers directly. Trained in both law (LLB) and finance (MBA), and a U.S. State Department Professional Fellow, she contributes applied research on markets, trade, and public finance at Hunar Saaz.",
  },
];

const domains = [
  {
    icon: HandHeart,
    title: "Social Protection, Poverty Reduction, and Inclusion",
    description:
      "Design, implementation, and evaluation of social protection systems — cash transfers, targeting systems, beneficiary registries, grievance redress, and adaptive social assistance that responds to poverty, shocks, and displacement.",
  },
  {
    icon: Users,
    title: "Gender Equality, Women's Empowerment, and Social Inclusion",
    description:
      "Gender-responsive policy design, evaluation, and institutional frameworks aligned with CEDAW, BPfA, and the SDGs — translating normative commitments into measurable outcomes through indicators, data systems, and accountability mechanisms.",
  },
  {
    icon: LineChart,
    title: "Monitoring, Evaluation, and Evidence for Decision-Making",
    description:
      "Quasi-experimental and mixed-methods evaluations, theory-based evaluation, impact assessments, and adaptive learning frameworks — M&E systems proportionate to capacity and embedded in planning cycles.",
  },
  {
    icon: Database,
    title: "Data Systems, Digital Transformation, and Registries",
    description:
      "Large-scale data systems, digital surveys, registries, EMIS, GIS-enabled systems, and real-time monitoring platforms — with data governance, quality assurance, and institutional ownership at the core.",
  },
  {
    icon: HeartPulse,
    title: "Health, Nutrition, WASH, and Human Development",
    description:
      "Programme design, needs assessments, outcome evaluations, and systems strengthening across health, nutrition, and WASH — particularly in fragile, disaster-affected, and underserved areas.",
  },
  {
    icon: GraduationCap,
    title: "Education, Skills, and Human Capital Development",
    description:
      "Sector planning, EMIS, school censuses, education financing, programme monitoring, and institutional reform — with attention to equity, access, and quality in marginalized regions.",
  },
  {
    icon: CloudSunRain,
    title: "Climate Resilience, Disaster Risk, and Fragility",
    description:
      "Disaster risk management, post-crisis recovery, climate vulnerability analysis, and resilience-oriented programme design — strengthening preparedness and adaptive capacity across sectors.",
  },
  {
    icon: Scale,
    title: "Governance, Public Sector Reform, and Institutional Strengthening",
    description:
      "Policy coherence, intergovernmental coordination, regulatory reform, organizational design, and embedded capacity strengthening — reforms that are realistic, politically aware, and sustainable.",
  },
];

const engagements = [
  {
    title: "National Socio-Economic Registry and Digital Poverty Targeting",
    tags: ["Social Protection", "Data Systems", "Implementation"],
    description:
      "Led the operational design and nationwide implementation of Pakistan's first end-to-end digital poverty census, covering over 35 million households — survey instruments, digital data architecture, field protocols, and real-time monitoring, laying the foundation for evidence-based targeting and large-scale financial inclusion of women beneficiaries.",
  },
  {
    title: "CEDAW and Beijing Platform for Action (BPfA+30) National Reporting",
    tags: ["Gender Equality", "Policy Reporting", "Institutional Coordination"],
    description:
      "National technical leadership for Pakistan's reporting to the United Nations under CEDAW and BPfA+30, with UN Women and the Ministry of Human Rights — gender-responsive indicator frameworks, multistakeholder consultations, and evidence synthesis aligning national commitments with international obligations.",
  },
  {
    title: "Digital Population and Housing Census (Pakistan)",
    tags: ["Governance", "Data Systems", "National Operations"],
    description:
      "Technical advisor to the Pakistan Bureau of Statistics for the country's first-ever digital Population and Housing Census — census design, operational planning, GIS-based mapping, logistics, and centralized monitoring supporting real-time decision-making during nationwide rollout.",
  },
  {
    title: "Post-Conflict Recovery and Cash Transfer Programming (Former FATA)",
    tags: ["Fragility", "Social Protection", "Programme Design"],
    description:
      "Design and implementation of large-scale recovery and cash transfer programmes for conflict-affected and displaced populations across seven districts — programme appraisal documents, targeting methodologies, monitoring frameworks, and outcome studies covering health, nutrition, education, livelihoods, and shelter.",
  },
  {
    title: "Trade Policy, Trade Diplomacy, and Institutional Reform",
    tags: ["Economic Governance", "Policy Advisory", "Public Institutions"],
    description:
      "Senior leadership in trade policy formulation, trade diplomacy, and institutional strengthening within the Ministry of Commerce and the Trade Development Authority of Pakistan — export strategies, impact assessments of trade agreements, and advisory support on investment and commercial policy.",
  },
  {
    title: "Education Systems Reform and EMIS Development",
    tags: ["Education", "Data Systems", "Institutional Capacity"],
    description:
      "Design, digitization, and institutionalization of Education Management Information Systems across multiple provinces — school censuses, GIS-based planning tools, third-party validations, and capacity building for evidence-based planning and accountability.",
  },
  {
    title: "Disaster Risk Management and Post-Disaster Recovery",
    tags: ["Climate & Disaster Risk", "Governance", "Service Delivery"],
    description:
      "Leadership in disaster risk reduction, emergency response, and post-disaster recovery across federal and provincial institutions — post-disaster needs assessments, recovery programme evaluations, and risk-informed planning in flood- and earthquake-affected regions.",
  },
  {
    title: "Governance Reform and Public Sector Institutional Strengthening",
    tags: ["Public Administration", "Systems Reform", "Political Economy"],
    description:
      "Senior leadership roles across federal and provincial governments — Secretary-level and Commissioner positions overseeing policy formulation, institutional reform, intergovernmental coordination, and implementation oversight across social sectors.",
  },
  {
    title: "Applied Research, Evaluation, and Learning Across Social Sectors",
    tags: ["Monitoring & Evaluation", "Evidence", "Learning"],
    description:
      "A wide range of applied research, evaluations, and learning engagements across social protection, gender, health, nutrition, WASH, education, disability inclusion, and humanitarian response — mixed-methods approaches translated into policy and programme improvements.",
  },
];

export default function AdvisoryPage() {
  return (
    <>
      <PageHero
        breadcrumb="Policy & Advisory"
        eyebrow="Hunar Saaz Platform"
        title="Policy, Research, and Institutional Advisory"
        description="Bridging the persistent gap between evidence, public decision-making, and implementation — supporting governments, development partners, and public and private institutions in designing solutions that are analytically rigorous, context-responsive, and operationally feasible."
      />

      <section className="py-14">
        <Container>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Who We Are" title="A Thinking Institution for the Social Sector" align="left" />
              <p className="mt-6 text-gray-600">
                We are a Pakistan-based policy, research, and institutional
                advisory platform working across the social sector. We operate
                through an integrated model that brings together policy
                analysis, applied research, programme design, monitoring and
                evaluation, and institutional strengthening within a single,
                coherent framework.
              </p>
              <p className="mt-4 text-gray-600">
                Sustainable development outcomes depend not only on sound
                policies, but on the institutional capacity and systems
                required to translate policy intent into real-world results.
                Hunar Saaz engages with governments and development partners as
                a thinking institution — focused on coherence, practicality,
                and long-term institutional effectiveness rather than
                standalone interventions or fragmented technical inputs.
              </p>
            </div>
            <Card className="p-8">
              <h3 className="font-display text-lg font-bold text-primary-900">
                One integrated framework
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Policy analysis",
                  "Applied research",
                  "Programme design",
                  "Monitoring & evaluation",
                  "Institutional strengthening",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-gray-500">
                Because policy, evidence, implementation, and capacity are
                inseparable in practice.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-14">
        <Container>
          <SectionHeading
            eyebrow="Why We Exist"
            title="From Policy Intent to Real-World Outcomes"
            description="Across Pakistan's social sector, well-articulated policies are routinely developed, yet their translation into coherent programmes and measurable results is often uneven. The gap reflects deeper structural weaknesses in how institutions plan, decide, and act."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {challenges.map((item) => (
              <Card key={item.title} className="p-6">
                <h3 className="font-semibold text-primary-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-gray-600">
            Hunar Saaz was established in response to these realities. It
            exists to strengthen the link between policy intent, evidence
            generation, and practical implementation — supporting institutions
            to move from well-meaning strategies to outcomes that are coherent,
            adaptive, and grounded in real-world conditions.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <SectionHeading eyebrow="How We Think" title="Principles That Guide Our Work" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl bg-primary-50 p-6">
                <Icon className="h-7 w-7 text-primary-600" />
                <h3 className="mt-3 font-semibold text-primary-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-primary-900 py-14 text-white">
        <Container>
          <SectionHeading
            eyebrow="What We Do"
            title="Integrated Advisory, Research, and Institutional Support"
            className="[&_h2]:text-white [&_p]:text-primary-200"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl bg-primary-800 p-6">
                <Icon className="h-7 w-7 text-secondary-400" />
                <h3 className="mt-3 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-primary-200">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <SectionHeading
            eyebrow="How We Work"
            title="Working With Institutions, Not Around Them"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {engagementPrinciples.map((item) => (
              <Card key={item.title} className="p-6">
                <h3 className="font-semibold text-primary-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-14">
        <Container>
          <SectionHeading
            eyebrow="Leadership & Collective Experience"
            title="Experience Applied With Judgement"
            description="Hunar Saaz is led by senior practitioners with over two decades of collective experience across policy, research, programme design, and institutional strengthening — working with governments, multilateral and bilateral development partners, international NGOs, and research institutions across Pakistan, South Asia, the Middle East, and Africa."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {associates.map((person) => (
              <Card key={person.name} className="p-6">
                <div className="flex items-start gap-4">
                  {person.photo ? (
                    <Image
                      src={person.photo}
                      alt={person.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <PlaceholderImage
                      label={person.name}
                      icon={Users}
                      seed={person.name}
                      className="h-20 w-20 shrink-0 rounded-xl"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-primary-900">{person.name}</h3>
                    <p className="mt-0.5 text-sm text-secondary-600">{person.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{person.bio}</p>
              </Card>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-gray-500">
            Hunar Saaz operates through a core leadership team supported by a
            wider network of senior associates and subject-matter experts —
            lean, while mobilizing specialized expertise as needed.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <SectionHeading
            eyebrow="Domains & Thematic Expertise"
            title="Expertise Organized Around Systems and Outcomes"
            description="Rather than operating through isolated sectoral silos, our work is organized around thematic areas where policy intent, evidence generation, implementation systems, and institutional incentives converge."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {domains.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="flex items-start gap-4 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-6 w-6 text-primary-600" />
                </span>
                <div>
                  <h3 className="font-semibold text-primary-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-14">
        <Container>
          <SectionHeading
            eyebrow="Geographic Experience & Exposure"
            title="Grounded in Pakistan, Informed by the Region"
          />
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-gray-600">
            <p>
              Within Pakistan, our leadership has worked across federal,
              provincial, and local governance systems — with direct experience
              spanning Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan,
              Gilgit-Baltistan, and Azad Jammu & Kashmir, in urban, peri-urban,
              and remote rural contexts, as well as fragile, disaster-affected,
              and conflict-impacted regions.
            </p>
            <p>
              Internationally, members of the team have contributed to policy,
              research, and advisory assignments across South Asia, the Middle
              East, and Africa — informing our understanding of comparative
              policy approaches, institutional design, and implementation
              challenges across different governance environments.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <SectionHeading
            eyebrow="Selected Experience"
            title="Engagement Snapshots"
            description="Selected leadership roles and engagements of Hunar Saaz's founding partners prior to the establishment of the firm."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {engagements.map((item) => (
              <Card key={item.title} className="p-6">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} tone="secondary">{tag}</Badge>
                  ))}
                </div>
                <h3 className="mt-3 font-semibold text-primary-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-primary-900 py-14 text-white">
        <Container>
          <SectionHeading
            eyebrow="Legal Status & Institutional Standing"
            title="Formal Incorporation and Institutional Status"
            className="[&_h2]:text-white [&_p]:text-primary-200"
          />
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-primary-100">
            <p>
              Hunar Saaz is a legally registered not-for-profit organization in
              Pakistan, registered under the Societies Registration Act, 1860,
              with its principal registration in Rawalpindi District, Punjab.
              The organization is also provisionally registered with the Punjab
              Charity Commission as a Category A entity, authorizing
              province-wide operations within Punjab.
            </p>
            <p>
              Hunar Saaz operates under a formal governance structure,
              including a General Council and Management Body, ensuring
              institutional oversight, accountability, and compliance with
              applicable regulatory requirements — enabling formal engagement
              with government entities, development partners, multilateral
              organizations, and civil society actors.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
