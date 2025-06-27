import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock, User, Phone, ArrowLeft } from 'phosphor-react';
import styles from './ScheduleAppointmentPage.module.scss';
import Swal from 'sweetalert2';

const ScheduleAppointmentPage: React.FC = () => {
  const [localName, setLocalName] = useState('');
  const [localId, setLocalId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [comments, setComments] = useState('');

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

    if (!preferredDate || !preferredTime || !contactName || !contactPhone) {
      Swal.fire('Error', 'Por favor, rellena todos los campos obligatorios (Fecha, Hora, Nombre, Teléfono).', 'error');
      //alert('Por favor, rellena todos los campos obligatorios (Fecha, Hora, Nombre, Teléfono).');
      return;
    }

    console.log('Solicitud de Cita para el Local:');
    console.log(`Local ID: ${localId}`);
    console.log(`Nombre del Local: ${localName}`);
    console.log(`Fecha Preferida: ${preferredDate}`);
    console.log(`Hora Preferida: ${preferredTime}`);
    console.log(`Nombre de Contacto: ${contactName}`);
    console.log(`Teléfono de Contacto: ${contactPhone}`);
    console.log(`Comentarios: ${comments}`);

    Swal.fire({
      title: '¡Cita Agendada!',
      text: `Tu cita para el local "${localName}" ha sido solicitada para el ${preferredDate} a las ${preferredTime}.`,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      background: '#E2E0C8',
      color: '#4E635E'
    }).then(() => {

      setPreferredDate('');
      setPreferredTime('');
      setContactName('');
      setContactPhone('');
      setComments('');
      navigate('/employee/my-locals');
    });
    //alert('Tu solicitud de cita ha sido enviada. El administrador se pondrá en contacto pronto.');
  };

  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={styles['schedule-appointment-page']}>
      <div className={styles['schedule-appointment-page__header']}>
        <button onClick={() => navigate(-1)} className={styles['schedule-appointment-page__back-button']}>
          <ArrowLeft size={20} /> Volver
        </button>

        <h2 className={styles['schedule-appointment-page__title']}>
          <CalendarCheck size={32} weight="duotone" /> Agendar Cita
        </h2>
      </div>

      <div className={styles['schedule-appointment-page__card']}>
        {localName && localId && (
          <p className={styles['schedule-appointment-page__local-info']}>
            Agendando cita para: <strong>{localName}</strong> (ID: {localId})
          </p>
        )}

        <form onSubmit={handleSubmit} className={styles['schedule-appointment-page__form']}>
          <div className={styles['schedule-appointment-page__form-group']}>
            <label htmlFor="preferredDate" className={styles['schedule-appointment-page__label']}>
              <CalendarCheck size={18} /> Fecha Preferida:
            </label>
            <input
              type="date"
              id="preferredDate"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className={styles['schedule-appointment-page__input']}
              min={getMinDate()} // Evita seleccionar fechas pasadas
              required
            />
          </div>

          <div className={styles['schedule-appointment-page__form-group']}>
            <label htmlFor="preferredTime" className={styles['schedule-appointment-page__label']}>
              <Clock size={18} /> Hora Preferida:
            </label>
            <input
              type="time"
              id="preferredTime"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className={styles['schedule-appointment-page__input']}
              required
            />
          </div>

          <div className={styles['schedule-appointment-page__form-group']}>
            <label htmlFor="contactName" className={styles['schedule-appointment-page__label']}>
              <User size={18} /> Tu Nombre Completo:
            </label>
            <input
              type="text"
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className={styles['schedule-appointment-page__input']}
              placeholder="Ej. Juan Pérez"
              required
            />
          </div>

          <div className={styles['schedule-appointment-page__form-group']}>
            <label htmlFor="contactPhone" className={styles['schedule-appointment-page__label']}>
              <Phone size={18} /> Teléfono de Contacto:
            </label>
            <input
              type="tel"
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className={styles['schedule-appointment-page__input']}
              placeholder="Ej. 55-1234-5678"
              required
            />
          </div>

          <div className={styles['schedule-appointment-page__form-group']}>
            <label htmlFor="comments" className={styles['schedule-appointment-page__label']}>
              Comentarios Adicionales (Opcional):
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              placeholder="Algún detalle adicional sobre la cita..."
              className={styles['schedule-appointment-page__textarea']}
            ></textarea>
          </div>

          <button type="submit" className={styles['schedule-appointment-page__submit-button']}>
            <CalendarCheck size={20} /> Enviar Solicitud de Cita
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleAppointmentPage;