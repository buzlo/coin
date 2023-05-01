import { el } from 'redom';
import * as ymaps3 from 'ymaps3';
import '../styles/map.scss';

export default class {
  constructor(coordinatesArray) {
    this.$el = el('.map');

    ymaps3.ready.then(async () => {
      const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker,
      } = ymaps3;
      this.ymap = new YMap(this.$el, {
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
      for (const object of coordinatesArray) {
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
