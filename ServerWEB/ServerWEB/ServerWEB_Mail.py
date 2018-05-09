import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

ADDR_ADMIN = ['maurin.denis.m@gmail.com']

USER_MAIL = '''
<h1>Merci pour votre aide</h1>
<p>Nous avons bien reçu votre message concernant un bug sur notre application. Nous nous excusons pour ce bug et nous vous remercions de nous avoir informé</p>
<p>Nous essayerons de corriger le problème dans les plus brefs delais</p>
<p>Cordialement, l'équipe de developpement</p>
'''

ADMIN_MAIL = '''
<h3>Un utilisateur a rapporté un bug : </h3>
<p>{}</p>
'''

def mail_report_bug(addr, text):
    #Server Config
    mailserver = smtplib.SMTP('smtp.gmail.com', 587)
    mailserver.ehlo()
    mailserver.starttls()
    mailserver.ehlo()
    mailserver.login('myhomemail.tmd@gmail.com', 'ChangeMe')
    
    #User Mail
    umail = MIMEMultipart()
    umail["From"] = 'Administration MyHome <myhomemail.tmd@gmail.com>'
    umail["To"] = addr
    umail["Subject"] = "Merci pour votre aide !"
    umail.attach(MIMEText(USER_MAIL, "html"))
    
    mailserver.sendmail('myhomemail.tmd@gmail.com', addr, umail.as_string())
    
    #Admin Mail
    amail = MIMEMultipart()
    amail["From"] = 'Administration MyHome <myhomemail.tmd@gmail.com>'
    amail["To"] = ",". join(ADDR_ADMIN)
    amail["Subject"] = "Un bug a été rapporté !"
    amail.attach(MIMEText(ADMIN_MAIL.format(text), "html"))
    
    mailserver.sendmail('myhomemail.tmd@gmail.com', ADDR_ADMIN, amail.as_string())
    mailserver.quit()
    


















    
    
    