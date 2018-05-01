import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText

def SendMail(m_from, m_to, m_text):
    msg = MIMEMultipart()
    msg['From'] = 'myhomemail.tmd@gmail.com'
    msg['To'] = 'maurin.denis.m@gmail.com'
    msg['Subject'] = 'Bug sur MyHome' 
    msg.attach(MIMEText(m_text))
    mailserver = smtplib.SMTP('smtp.gmail.com', 587)
    mailserver.ehlo()
    mailserver.starttls()
    mailserver.ehlo()
    mailserver.login('myhomemail.tmd@gmail.com', 'ChangeMe')
    mailserver.sendmail('myhomemail.tmd@gmail.com', 'myhomemail.tmd@gmail.com', msg.as_string())
    mailserver.quit()