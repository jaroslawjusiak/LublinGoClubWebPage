import type { Lesson } from '../lib/lessons/repository';

/** Initial files bundled with the site; only used without Supabase configuration. */
export const initialLessons: Lesson[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    title: 'Kształty (2026)',
    description:
      'Poznaj podstawowe kształty kamieni i ich zastosowania w ataku, obronie oraz budowaniu połączeń. Materiał porównuje m.in. nobi, kosumi, hane, skoki i paszczę tygrysa, zwracając uwagę na oddechy, oczność, wydajność i słabe punkty.',
    pdfUrl: '/assets/lekcje/ksztalty-2026.pdf',
    thumbnailUrl: '/assets/lekcje/thumbnails/ksztalty-2026.webp',
    language: 'pl',
    pageCount: 18,
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    title: 'Jak atakować (2026)',
    description:
      'Atak w Go służy uzyskiwaniu korzyści ze słabości przeciwnika: zdobywaniu terenu, wzmacnianiu własnych grup i budowaniu wpływów. Diagramy pokazują, jak wybrać kierunek ataku i dlaczego próba zabicia grupy za wszelką cenę może obrócić się przeciwko atakującemu.',
    pdfUrl: '/assets/lekcje/jak-atakowac-2026.pdf',
    thumbnailUrl: '/assets/lekcje/thumbnails/jak-atakowac-2026.webp',
    language: 'pl',
    pageCount: 9,
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    title: 'Fuseki — jak grać otwarcia (2026)',
    description:
      'Materiał wyjaśnia kolejność zajmowania rogów i brzegów oraz znaczenie hoshi, komoku, shimari i kakari. Pokazuje też, jak dobierać kierunek gry i spokojnie odpowiadać na nietypowe otwarcia, duże moyo oraz agresywną grę przeciwnika.',
    pdfUrl: '/assets/lekcje/fuseki-2026.pdf',
    thumbnailUrl: '/assets/lekcje/thumbnails/fuseki-2026.webp',
    language: 'pl',
    pageCount: 23,
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    title: 'Yose — wartość ruchów w końcówce (2025)',
    description:
      'Dowiedz się, kiedy zaczyna się yose i jak oceniać ruchy domykające granice terytorium. Przykłady rozróżniają sente, gote i odwrócone sente oraz pokazują, jak kolejność zagrań wpływa na końcowy bilans punktów.',
    pdfUrl: '/assets/lekcje/yose-2025.pdf',
    thumbnailUrl: '/assets/lekcje/thumbnails/yose-2025.webp',
    language: 'pl',
    pageCount: 12,
  },
  {
    id: '00000000-0000-4000-8000-000000000005',
    title: 'Walka ko (2025)',
    description:
      'Lekcja wyjaśnia regułę ko i rolę gróźb, które pozwalają odciągnąć przeciwnika od lokalnej walki. Uczy szukania i oceny wielkości gróźb, a na końcu proponuje ćwiczenie z rozpoznawania ich na planszy.',
    pdfUrl: '/assets/lekcje/walka-ko-2025.pdf',
    thumbnailUrl: '/assets/lekcje/thumbnails/walka-ko-2025.webp',
    language: 'pl',
    pageCount: 7,
  },
  {
    id: '00000000-0000-4000-8000-000000000006',
    title: 'Równowaga — terytorium i wpływy (2025)',
    description:
      'Poznaj różnicę między pewnym terenem a strefą wpływów i zobacz, dlaczego oba zasoby są potrzebne. Diagramy pokazują wydajne otaczanie terytorium, wykorzystanie siły w ataku i transfer wpływów, a przykład partii ilustruje zachowanie równowagi na całej planszy.',
    pdfUrl: '/assets/lekcje/rownowaga-2025.pdf',
    thumbnailUrl: '/assets/lekcje/thumbnails/rownowaga-2025.webp',
    language: 'pl',
    pageCount: 16,
  },
  {
    id: '00000000-0000-4000-8000-000000000007',
    title: 'Inwazja, redukcja, budowanie (2025)',
    description:
      'Materiał pomaga zdecydować, kiedy wejść w obszar przeciwnika, kiedy go tylko zmniejszyć, a kiedy rozbudować własną pozycję. Omawia przygotowanie inwazji, bezpieczeństwo grup oraz redukcję ruchem shoulder hit, zestawiając niszczenie cudzego potencjału z budowaniem własnego.',
    pdfUrl: '/assets/lekcje/inwazja-redukcja-budowanie-2025.pdf',
    thumbnailUrl: '/assets/lekcje/thumbnails/inwazja-redukcja-budowanie-2025.webp',
    language: 'pl',
    pageCount: 17,
  },
  {
    id: '00000000-0000-4000-8000-000000000008',
    title: 'Fuseki — ćwiczenia praktyczne (2025)',
    description:
      'Krótki, dwustronicowy materiał przypomina, by w otwarciu nie ograniczać się do jednej części planszy. Pusta plansza stanowi punkt wyjścia do ćwiczenia rozmieszczania kamieni i szukania możliwości budowania terenu w różnych obszarach.',
    pdfUrl: '/assets/lekcje/fuseki-cwiczenia-2025.pdf',
    thumbnailUrl: '/assets/lekcje/thumbnails/fuseki-cwiczenia-2025.webp',
    language: 'pl',
    pageCount: 2,
  },
  {
    id: '00000000-0000-4000-8000-000000000009',
    title: 'Filozofia Dalekiego Wschodu w Go',
    description:
      'Prezentacja przedstawia związki Go z konfucjanizmem, taoizmem i buddyzmem oraz kulturowe opowieści o pochodzeniu gry. Omawia także mentalność rozwojową, poczucie własnej wartości i kontrolę emocji jako elementy uczenia się i samodoskonalenia.',
    pdfUrl: '/assets/lekcje/filozofia-dalekiego-wschodu.pdf',
    thumbnailUrl: '/assets/lekcje/thumbnails/filozofia-dalekiego-wschodu.webp',
    language: 'pl',
    pageCount: 18,
  },
];
