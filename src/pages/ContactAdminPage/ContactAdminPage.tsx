import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EnvelopeSimple, PaperPlaneTilt, ArrowLeft } from 'phosphor-react';
import styles from './ContactAdminPage.module.scss';
import Swal from 'sweetalert2';


const ContactAdminPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [localName, setLocalName] = useState('');
  const [localId, setLocalId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('localId');
    const name = params.get('localName');

    if (id) setLocalId(id);
    if (name) setLocalName(decodeURIComponent(name));
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      Swal.fire('Error', 'Por favor, escribe un mensaje.', 'error');
      return;
    }

    console.log(`Enviando mensaje al administrador para el Local ID: ${localId}`);
    console.log(`Nombre del Local: ${localName}`);
    console.log(`Mensaje: ${message}`);

    Swal.fire({
      title: '¡Enviado!',
      text: 'Tu mensaje ha sido enviado al administrador.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      background: '#E2E0C8',
      color: '#4E635E',
    }).then(() => {
      setMessage('');
      navigate('/employee/my-locals');
    });
  };

  return (
    <div className={styles['contact-admin-page']}>
      <div className={styles['contact-admin-page__header']}>
        <button onClick={() => navigate(-1)} className={styles['contact-admin-page__back-button']}>
          <ArrowLeft size={20} weight="bold" /> Volver
        </button>
        <h2 className={styles['contact-admin-page__title']}>
          <EnvelopeSimple size={32} weight="duotone" /> Contactar al Administrador
        </h2>
      </div>

      <div className={styles['contact-admin-page__card']}>
        {localName && localId && (
          <p className={styles['contact-admin-page__local-info']}>
            Enviando mensaje sobre: <strong>{localName}</strong> (ID: {localId})
          </p>
        )}

        <form onSubmit={handleSubmit} className={styles['contact-admin-page__form']}>
          <div className={styles['contact-admin-page__form-group']}>
            <label htmlFor="message" className={styles['contact-admin-page__label']}>
              Tu Mensaje:
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Escribe aquí tu consulta o comentario..."
              className={styles['contact-admin-page__textarea']}
              required
            ></textarea>
          </div>

          <button type="submit" className={styles['contact-admin-page__submit-button']}>
            <PaperPlaneTilt size={20} /> Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactAdminPage;