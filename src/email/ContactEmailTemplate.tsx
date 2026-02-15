import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text
} from "@react-email/components"

interface Props {
  name: string
  email: string
  subject: string
  message: string
}

export const ContactEmailTemplate = ({
  name,
  email,
  subject,
  message
}: Props) => {
  return (
    <Html lang="es">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta
          name="color-scheme"
          content="light only"
        />
        <meta
          name="supported-color-schemes"
          content="light only"
        />
      </Head>

      <Preview>
        Mensaje de {name}: {subject}
      </Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.logoSection}>
            <Img
              src="https://www.risecol.com/svg/logo-rise-black.svg"
              width="36"
              height="36"
              alt="Rise"
              style={styles.logo}
            />
          </Section>

          <Heading
            as="h1"
            style={styles.title}
          >
            Nuevo mensaje de contacto
          </Heading>
          <Text style={styles.subtitle}>
            {name} te ha enviado un mensaje desde tu sitio web.
          </Text>

          <Hr style={styles.divider} />

          <Section style={styles.infoSection}>
            <Text style={styles.label}>Remitente</Text>
            <Text style={styles.value}>{name}</Text>

            <Section style={styles.spacer} />

            <Text style={styles.label}>Correo electrónico</Text>
            <Text style={styles.valueEmail}>{email}</Text>

            <Section style={styles.spacer} />

            <Text style={styles.label}>Asunto</Text>
            <Text style={styles.value}>{subject}</Text>
          </Section>

          <Hr style={styles.divider} />

          <Section style={styles.messageSection}>
            <Text style={styles.label}>Mensaje</Text>
            <Section style={styles.messageBox}>
              <Text style={styles.messageText}>{message}</Text>
            </Section>
          </Section>

          <Section style={styles.ctaSection}>
            <Button
              href={`mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`}
              style={styles.button}
            >
              Responder mensaje
            </Button>
          </Section>

          <Hr style={styles.divider} />

          <Text style={styles.footer}>
            Este correo fue generado automáticamente desde{" "}
            <span style={styles.footerLink}>risecol.com</span>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body: {
    backgroundColor: "#f5f5f7",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    margin: "0" as const,
    padding: "0" as const
  } as React.CSSProperties,

  container: {
    backgroundColor: "#ffffff",
    maxWidth: "520px",
    margin: "40px auto",
    borderRadius: "16px",
    padding: "48px 40px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)"
  } as React.CSSProperties,

  logoSection: {
    textAlign: "center" as const,
    marginBottom: "32px"
  } as React.CSSProperties,

  logo: {
    display: "inline-block" as const,
    margin: "0 auto"
  } as React.CSSProperties,

  title: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#1d1d1f",
    textAlign: "center" as const,
    letterSpacing: "-0.02em",
    lineHeight: "28px",
    margin: "0 0 8px"
  } as React.CSSProperties,

  subtitle: {
    fontSize: "14px",
    color: "#6e6e73",
    textAlign: "center" as const,
    lineHeight: "20px",
    margin: "0 0 0"
  } as React.CSSProperties,

  divider: {
    borderColor: "#e5e5ea",
    borderWidth: "0 0 1px 0",
    borderStyle: "solid" as const,
    margin: "28px 0"
  } as React.CSSProperties,

  infoSection: {
    padding: "0"
  } as React.CSSProperties,

  spacer: {
    height: "20px"
  } as React.CSSProperties,

  label: {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    color: "#8e8e93",
    margin: "0 0 4px",
    lineHeight: "16px"
  } as React.CSSProperties,

  value: {
    fontSize: "16px",
    fontWeight: 400,
    color: "#1d1d1f",
    lineHeight: "22px",
    margin: "0"
  } as React.CSSProperties,

  valueEmail: {
    fontSize: "16px",
    fontWeight: 400,
    color: "#1d1d1f",
    lineHeight: "22px",
    margin: "0",
    wordBreak: "break-all" as const
  } as React.CSSProperties,

  messageSection: {
    padding: "0"
  } as React.CSSProperties,

  messageBox: {
    backgroundColor: "#f5f5f7",
    borderRadius: "12px",
    padding: "20px",
    marginTop: "8px"
  } as React.CSSProperties,

  messageText: {
    fontSize: "15px",
    fontWeight: 400,
    color: "#3a3a3c",
    lineHeight: "24px",
    margin: "0",
    whiteSpace: "pre-line" as const
  } as React.CSSProperties,

  ctaSection: {
    textAlign: "center" as const,
    margin: "32px 0 0"
  } as React.CSSProperties,

  button: {
    backgroundColor: "#1d1d1f",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "980px",
    padding: "12px 28px",
    textDecoration: "none" as const,
    display: "inline-block" as const
  } as React.CSSProperties,

  footer: {
    fontSize: "12px",
    color: "#aeaeb2",
    textAlign: "center" as const,
    lineHeight: "18px",
    margin: "0"
  } as React.CSSProperties,

  footerLink: {
    color: "#8e8e93"
  } as React.CSSProperties
}
