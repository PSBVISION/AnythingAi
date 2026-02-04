import { BotIcon, WorkflowIcon, PlugIcon, ShieldCheckIcon, BarChartIcon, UsersIcon } from "lucide-react";
import type { IFeature } from "../types";

export const features: IFeature[] = [
    {
        title: "Agents That Act — Not Just Predict",
        description:
            "Our AI agents execute workflows, automate decisions, and trigger actions across systems — not just generate predictions.",
        icon: BotIcon
    },
    {
        title: "Full Auditability & Transparency",
        description:
            "Every decision and action is logged with traceable reasoning and proof-of-execution — ideal for regulated industries.",
        icon: WorkflowIcon
    },
    {
        title: "Enterprise Integrations",
        description:
            "Connect natively to Salesforce, SAP, Oracle and more — deploy in days, not months.",
        icon: PlugIcon
    },
    {
        title: "Governance & Control",
        description:
            "Built-in role-based access, approval workflows, kill switches, and compliance guardrails keep humans in control.",
        icon: ShieldCheckIcon,
    },
    {
        title: "Enterprise-Grade SLAs",
        description:
            "Designed for critical operations with 99.9% uptime, 24/7 support, and enterprise-ready deployments.",
        icon: BarChartIcon,
    },
    {
        title: "Cross-Agent Collaboration",
        description:
            "Agents work together to solve complex, multi-domain problems without central control.",
        icon: UsersIcon,
    },
]