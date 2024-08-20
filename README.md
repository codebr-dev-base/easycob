
# CRM - Yasycob developed for Yuan Soluções

Um CRM de cobrança desenvolvido para uma empresa terceirizada que atua no setor de água e esgoto é uma solução tecnológica projetada para otimizar a gestão e o acompanhamento das interações com clientes inadimplentes. Este sistema permite à empresa gerenciar dados de clientes, registrar histórico de cobranças, agendar lembretes, e acompanhar o status de pagamentos de forma eficiente. Além disso, oferece recursos avançados de segmentação de clientes, geração de relatórios detalhados, e integração com sistemas de telefonia e e-mail, garantindo uma abordagem personalizada e eficaz na recuperação de débitos, enquanto mantém a conformidade com as regulamentações do setor.


## System boot information

The queuing system used is: bull-queue with @rlanz/bull-queue integration plugin.

### Queue initialization.

```script
node ace queue:listen 
node ace queue:listen --queue=LoadCsv
node ace queue:listen --queue=ActionsOparation
node ace queue:listen --queue=ActionsEmail
node ace queue:listen --queue=ActionsSms
node ace queue:listen --queue=SendEmail
node ace queue:listen --queue=SendSms
node ace queue:listen --queue=SendInvoice
```