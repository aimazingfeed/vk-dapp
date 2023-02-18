import { useEffect, useState } from 'react';
import { Cell, Group, Spinner, useModalRootContext } from '@vkontakte/vkui';

export const ConnectWallet = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { updateModalHeight } = useModalRootContext();

  // const fetchItems = () => {
  //   fetch('')
  //     .then((r) => r.json())
  //     .then((items) => {
  //       setItems(items);
  //       setIsLoading(false);
  //     });
  // };

  // useEffect(fetchItems, []);

  // После установки стейта и перерисовки компонента SelectModal сообщим ModalRoot об изменениях
  useEffect(updateModalHeight, [updateModalHeight]);

  return (
    <div className="SelectModal">
      {isLoading && <Spinner />}
      {!isLoading && (
        <Group>
          {items.map((item) => (
            <Cell key={item.id}>{item.title}</Cell>
          ))}
        </Group>
      )}
      SAY HELLO TO MY LITTLE FRIEND )
    </div>
  );
};
