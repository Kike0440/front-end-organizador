import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Local } from '../../types/Local';
import { initialMockLocals } from '../../data/mockLocals';
import {
    Buildings,
    MapPin,
    CurrencyDollar,
    XCircle,
    Info,
    Ruler,
    ImageSquare,
    ArrowLeft,
    Megaphone
} from 'phosphor-react';
import styles from './LocalDetailPage.module.scss';

const LocalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [locals] = useLocalStorage<Local[]>('commercialLocals', initialMockLocals);

  const local = locals.find(loc => loc.id === id);

  if (!local) {
    return (
      <div className={styles['local-detail-page']}>
        <div className={styles['local-detail-page__not-found']}>
          <XCircle size={64} color="#dc3545" />
          <h2>Local no encontrado</h2>
          <p>El local con ID "{id}" no existe o ha sido eliminado.</p>
          <button onClick={() => navigate(-1)} className={styles['local-detail-page__back-button']}>
            <ArrowLeft size={20} /> Volver
          </button>
        </div>
      </div>
    );
  }

  const getStatusText = (status: Local['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'rented': return 'Rentado';
      case 'maintenance': return 'En Mantenimiento';
      default: return '';
    }
  };

  return (
    <div className={styles['local-detail-page']}>
      <div className={styles['local-detail-page__header']}>
        <button onClick={() => navigate(-1)} className={styles['local-detail-page__back-button']}>
          <ArrowLeft size={24} weight="bold" /> Volver a la Lista
        </button>
        <h2 className={styles['local-detail-page__title']}>
          <Buildings size={32} weight="duotone" /> Detalles del Local: {local.name}
        </h2>
      </div>

      <div className={styles['local-detail-page__card']}>
        <img
            src={local.imageUrl || 'https://via.placeholder.com/600x400/cccccc/333333?text=Local'}
            alt={local.name}
            className={styles['local-detail-page__image']}
        />

        <div className={styles['local-detail-page__info']}>
          <p className={styles['local-detail-page__info-item']}>
            <MapPin size={24} weight="duotone" />
            <strong>Dirección:</strong> {local.address}
          </p>
          <p className={styles['local-detail-page__info-item']}>
            <CurrencyDollar size={24} weight="duotone" />
            <strong>Precio:</strong> ${local.price.toLocaleString()} / mes
          </p>
          <p className={`${styles['local-detail-page__info-item']} ${styles[`local-detail-page__info-item--status-${local.status}`]}`}>
            <Info size={24} weight="duotone" />
            <strong>Estado:</strong> {getStatusText(local.status)}
          </p>
          {local.sizeSqMeters && (
            <p className={styles['local-detail-page__info-item']}>
              <Ruler size={24} weight="duotone" />
              <strong>Tamaño:</strong> {local.sizeSqMeters} m²
            </p>
          )}
          {local.description && (
            <div className={styles['local-detail-page__description']}>
              <div className={styles['local-detail-page__description-header']}>
                <Megaphone size={24} weight="duotone" />
                <strong>Descripción:</strong>
              </div>
              <p>{local.description}</p>
            </div>
          )}
          {local.imageUrl && (
            <div className={styles['local-detail-page__description']}>
              <div className={styles['local-detail-page__description-header']}>
                <ImageSquare size={24} weight="duotone" />
                <strong>URL de Imagen:</strong>
              </div>
              <a href={local.imageUrl} target="_blank" rel="noopener noreferrer">{local.imageUrl}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocalDetailPage;