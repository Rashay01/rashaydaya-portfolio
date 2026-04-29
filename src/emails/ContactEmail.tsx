import {
  Body,
  Container,
  Hr,
  Html,
  Text,
} from '@react-email/components'

type ContactEmailProps = {
  name: string
  email: string
  message: string
  timestamp: string
}

const mono = 'Courier New, Courier, monospace'

const styles = {
  body: {
    backgroundColor: '#111418',
    margin: '0',
    padding: '0',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    fontFamily: mono,
    fontSize: '10px',
    color: '#ff5f1f',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
    margin: '0 0 4px',
  },
  divider: {
    borderColor: '#ff5f1f',
    borderTopWidth: '1px',
    margin: '12px 0',
  },
  label: {
    fontFamily: mono,
    fontSize: '9px',
    color: '#94A3B8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    margin: '8px 0 2px',
  },
  value: {
    fontFamily: mono,
    fontSize: '12px',
    color: '#e8e6e1',
    margin: '0 0 4px',
  },
  messageBody: {
    fontFamily: mono,
    fontSize: '13px',
    color: '#e8e6e1',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap' as const,
    margin: '0',
  },
  footer: {
    fontFamily: mono,
    fontSize: '9px',
    color: '#94A3B8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    margin: '0',
  },
}

export function ContactEmail({ name, email, message, timestamp }: ContactEmailProps) {
  return (
    <Html>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.header}>Technical Vanguard — Inbound Message</Text>
          <Hr style={styles.divider} />
          <Text style={styles.label}>To</Text>
          <Text style={styles.value}>rashay.jcdaya@gmail.com</Text>
          <Text style={styles.label}>Sender</Text>
          <Text style={styles.value}>{name} &lt;{email}&gt;</Text>
          <Text style={styles.label}>Timestamp</Text>
          <Text style={styles.value}>{timestamp}</Text>
          <Hr style={styles.divider} />
          <Text style={styles.messageBody}>{message}</Text>
          <Hr style={styles.divider} />
          <Text style={styles.footer}>Reply directly to {email}</Text>
        </Container>
      </Body>
    </Html>
  )
}
