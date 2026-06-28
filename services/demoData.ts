import { AnalysisResult, UploadedFile } from '../types';

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  files: { name: string; size: number; type: 'image' | 'pdf' | 'other' }[];
  result: AnalysisResult;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'case-a',
    title: 'Case A: Delayed Payment & Excuses',
    subtitle: 'High Risk (Complete Ghosting)',
    description: 'Invoice #1024 ($5,200) for AeroTech Solutions is 30 days overdue. David promised payment twice in chat but has now ghosted. Bank logs confirm $0.00 received.',
    files: [
      { name: 'invoice_1024_aerotech.pdf', size: 145000, type: 'pdf' },
      { name: 'slack_chat_screenshot_david.png', size: 284000, type: 'image' },
      { name: 'bank_statement_may_june.csv', size: 12000, type: 'other' }
    ],
    result: {
      summary: 'Invoice INV-1024 ($5,200.00) issued to AeroTech Solutions is 30 days overdue. Although David (AeroTech Representative) promised in chat that the payment was scheduled for May 30 and June 15, bank records show zero matching deposits. Client communication has ceased since June 15.',
      invoiceDetails: {
        number: 'INV-1024',
        dueDate: '2026-05-28',
        amount: '5200',
        status: 'Overdue'
      },
      findings: [
        'Invoice INV-1024 issued on April 28, 2026, for $5,200.00 with a 30-day term.',
        'Chat transcript shows client promised to wire funds on May 30, and then again on June 15.',
        'Cross-reference of May-June bank statements shows no deposits matching $5,200.00 or from AeroTech.',
        'Client has ceased responding to consecutive reminders sent on June 20, 22, and 25 (10-day ghosting period).'
      ],
      financialStats: {
        expected: 5200,
        overdue: 5200,
        currency: '$'
      },
      riskProfile: {
        level: 'HIGH',
        factor: 95,
        description: 'Client has missed multiple written payment commitments and is currently unresponsive. Highly critical cash flow impact of $5,200.00.'
      },
      clientBehaviorAnalysis: `Repeatedly offering plausible verbal/written delays ('cash flow tight') followed by complete unresponsiveness. Immediate firm intervention is required.`,
      confidenceAssessment: {
        level: 'High',
        reason: '100% correlation between invoice, explicit promises in chat logs, and comprehensive bank deposits covering the relevant periods.'
      },
      recommendedActions: [
        {
          type: 'ESCALATION',
          title: 'Final Legal Demand Notice',
          draftContent: `Subject: URGENT: Final Notice of Unpaid Invoice INV-1024 ($5,200.00)

Dear David,

We are writing to you regarding Invoice INV-1024 for $5,200.00, which is now 30 days past due.

We accommodated your previous requests for delays on May 30 and June 15 based on your written assurances. However, we have yet to receive the funds, and our recent inquiries over the last ten days have gone unanswered.

Please be advised that unless payment is received in full or a formal settlement is signed by close of business on June 30, 2026, we will be forced to suspend your active service account and forward this matter to our legal collections agency.

We hope to resolve this amicably. Please remit the payment using our bank details listed on the invoice.

Sincerely,
[Your Name]
InvoiceMind Billing Coordinator`
        },
        {
          type: 'REMINDER',
          title: 'Firm Follow-Up Email',
          draftContent: `Subject: Status of Overdue Payment - INV-1024 ($5,200.00)

Dear David,

Our accounting team has not yet cleared the $5,200.00 payment for Invoice INV-1024, which you confirmed was being wired.

Could you please provide the bank transaction reference number or a PDF of the wire confirmation so that we can verify with our treasury department?

If cash flow is currently an issue, please let us know today so we can draft a formal payment schedule.

Best regards,
[Your Name]`
        }
      ]
    }
  },
  {
    id: 'case-b',
    title: 'Case B: Payment Discrepancy Dispute',
    subtitle: 'Medium Risk (Partial Payment Mismatch)',
    description: 'Invoice #1025 ($3,000) for PixelCraft Studio was due 5 days ago. Client messages "paid in full yesterday!" but bank logs show only $1,800 arrived.',
    files: [
      { name: 'invoice_1025_pixelcraft.pdf', size: 112000, type: 'pdf' },
      { name: 'whatsapp_chat_pixelcraft.txt', size: 8000, type: 'other' },
      { name: 'bank_credits_recent.csv', size: 5000, type: 'other' }
    ],
    result: {
      summary: 'Invoice INV-1025 ($3,000.00) is partially settled. The client claims in chat to have completed the full $3,000 payment, but bank records verify that only $1,800.00 was deposited on June 27, leaving an unexplained $1,200.00 deficit.',
      invoiceDetails: {
        number: 'INV-1025',
        dueDate: '2026-06-23',
        amount: '3000',
        status: 'Partially Paid'
      },
      findings: [
        'Invoice INV-1025 issued for $3,000.00 with a due date of June 23, 2026.',
        `PixelCraft chat contact (Elena) messaged on June 27: 'Hey! Sent the full payment of $3,000 yesterday. Cheers!'`,
        'Bank statements verify a credit of exactly $1,800.00 from PixelCraft Inc. on June 27.',
        'The mismatch stands at $1,200.00, suggesting either an administration input error or an uncommunicated dispute/deduction.'
      ],
      financialStats: {
        expected: 3000,
        overdue: 1200,
        currency: '$'
      },
      riskProfile: {
        level: 'MEDIUM',
        factor: 55,
        description: 'Communication is active and a major portion of the payment has been paid, but the client incorrectly believes they have fully cleared their balance.'
      },
      clientBehaviorAnalysis: 'Highly responsive and cooperative, but prone to transaction errors or silent deduction offsets. Demands a helpful reconciliation inquiry.',
      confidenceAssessment: {
        level: 'High',
        reason: 'Mathematical discrepancy between client message claim and official bank deposit ledger is starkly evident.'
      },
      recommendedActions: [
        {
          type: 'SETTLEMENT',
          title: 'Discrepancy Reconciliation Letter',
          draftContent: `Subject: Payment Reconciliation for Invoice INV-1025 - Balance $1,200.00

Hi Elena,

Thank you for sending the payment for Invoice INV-1025. We received a deposit of $1,800.00 credited to your account on June 27.

We wanted to reach out because your message on June 26 indicated that the full $3,000.00 was transferred. Currently, there remains a balance of $1,200.00 on this invoice.

Could you please verify the wire receipt or let us know if there was an administrative deduction or a separate invoice offset that we should account for?

We would love to get this reconciled and squared away for you.

Warmly,
[Your Name]
InvoiceMind Billing team`
        }
      ]
    }
  },
  {
    id: 'case-c',
    title: 'Case C: Confirmed Settled Payment',
    subtitle: 'Low Risk (Perfect Match)',
    description: 'Invoice #1026 ($1,500) for Vertex Labs. Client messages "Sent payment!" today, and bank log confirms cleared transfer of exactly $1,500.',
    files: [
      { name: 'invoice_1026_vertex.pdf', size: 98000, type: 'pdf' },
      { name: 'imessage_chat_vertex.txt', size: 2000, type: 'other' },
      { name: 'bank_statement_live_api.csv', size: 3000, type: 'other' }
    ],
    result: {
      summary: `Invoice INV-1026 ($1,500.00) for Vertex Labs is fully settled. The client's chat notification is backed up 100% by a matching deposit in the bank ledger.`,
      invoiceDetails: {
        number: 'INV-1026',
        dueDate: '2026-06-28',
        amount: '1500',
        status: 'Paid'
      },
      findings: [
        'Invoice INV-1026 for $1,500.00 due on June 28, 2026.',
        `Vertex representative messaged 'All paid up!' on June 28.`,
        'Bank credits show a cleared credit of exactly $1,500.00 from Vertex Labs on June 28.',
        'Zero outstanding balance. Transaction successfully matched and closed.'
      ],
      financialStats: {
        expected: 1500,
        overdue: 0,
        currency: '$'
      },
      riskProfile: {
        level: 'LOW',
        factor: 5,
        description: 'Payment terms were honored perfectly, matching invoice and bank transactions 1-to-1.'
      },
      clientBehaviorAnalysis: 'Exemplary. Professional, highly reliable, and completes transfers exactly on or before the due date.',
      confidenceAssessment: {
        level: 'High',
        reason: 'Perfect 1-to-1 match between invoice terms, explicit confirmation in chat, and cleared bank ledger record.'
      },
      recommendedActions: [
        {
          type: 'REMINDER',
          title: 'Payment Receipt Acknowledgement',
          draftContent: `Subject: Payment Received - Thank you! Invoice INV-1026

Dear Vertex Labs Team,

We are writing to confirm that we have received your payment of $1,500.00 in full settlement of Invoice INV-1026.

Your account has been updated and holds a $0.00 balance. We greatly appreciate your prompt payment and continued partnership!

Have a wonderful week ahead.

Sincerely,
[Your Name]
InvoiceMind Billing Team`
        }
      ]
    }
  }
];
