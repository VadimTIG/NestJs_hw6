import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailController } from './mail.controller';

@Module({
  controllers: [MailController],
  imports: [
    MailerModule.forRoot({
      transport:
        'smtps://vad2024@internet.ru:U9CQpRkTYwkbsG4J1uKs@smtp.mail.ru',

      defaults: {
        from: '"nest-modules" <vad2024@internet.ru>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
