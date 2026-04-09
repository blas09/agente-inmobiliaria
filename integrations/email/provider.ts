export interface EmailProvider {
  sendTransactionalEmail(input: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<void>;
}
