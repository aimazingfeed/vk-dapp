import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import PropTypes from 'prop-types';

import persik from '../img/persik.png';

import styles from './styles.module.css';

const Persik = ({ ...props }) => (
  <Panel id={props.id}>
    <PanelHeader before={<PanelHeaderBack onClick={props.go} data-to="home" />}>Persik</PanelHeader>
    <img className={styles.persik} src={persik} alt="Persik The Cat" />
  </Panel>
);

Persik.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
};

export default Persik;
