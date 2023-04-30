import { el, setChildren } from 'redom';
import * as ymaps3 from 'ymaps3';
import '../styles/banks.scss';

export default class {
  constructor(banksData) {
    this.$container = el('.banks.container.main-container');

    const $banksTitle = el('h2.banks__title.window-title', 'Карта банкоматов');

    ymaps3.ready.then(async () => {
      this.$map = el('.banks__map.map');
      setChildren(this.$container, [$banksTitle, this.$map]);

      const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker,
      } = ymaps3;
      this.ymap = new YMap(this.$map, {
        location: {
          // Координаты центра карты.
          // Порядок по умолчанию: «долгота, широта».
          center: [52, 35],

          // Уровень масштабирования. Допустимые значения:
          // от 0 (весь мир) до 19.
          zoom: 6,
        },
      });

      this.ymap.addChild(new YMapDefaultSchemeLayer());
      this.ymap.addChild(new YMapDefaultFeaturesLayer());
      for (const object of banksData) {
        const marker = el('.map__marker');
        this.ymap.addChild(
          new YMapMarker(
            {
              coordinates: [object.lat, object.lon],
              title: 'Hello World!',
              subtitle: 'kind and bright',
            },
            marker
          )
        );
      }
    });
  }
}
