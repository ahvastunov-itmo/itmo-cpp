---
title: "Лекция 13. STL: контейнеры, итераторы и алгоритмы"
---

::: {.content-visible unless-format="revealjs"}

[Открыть слайды](slides/13-stl-containers-iterators-algorithms.html){.btn .btn-outline-primary target="_blank"}

:::

## Язык С++


- STL. Итераторы и основные алгоритмы

## Вычислительная сложность


- Функция зависимости объёма работы алгоритма от размера входных данных
- Асимптотическая сложность (O(n),O(n*n), O(n*log(n)))

## STL


- Библиотека обобщённых компонентов
- Контейнеры
- Обобщенные алгоритмы
- Итераторы
- Функциональные объекты
- Адаптеры
- Аллокаторы
- Вспомогательные функции
- Гарантии производительности

## Контейнеры


- Контейнеры последовательностей:
- vector<T>
- deque<T>
- list<T>
- array<T>
- forward_list<T>
- Ассоциативные контейнеры:
- set<Key> (multiset)
- map<Key,T> (multimap)
- Неупорядоченные ассоциативные контейнеры
- unordered_set<Key> (multiset)
- unordered_map<Key, T> (unordered_multimap)

## Обобщенные алгоритмы


- Find
- Max
- Merge
- Replace
- Sort
- ...

## Итераторы


- Указателеподобные объекты
- Связь между алгоритмами и контейнерами
- Категории
- Выходные (LegacyOutputIterator)
- Входные (LegacyInputIterator)
- Однонаправленные (LegacyForwardIterator)
- Двунаправленные (LegacyBidirectionalIterator)
- Произвольного доступа (LegacyRandomAccessIterator)
- Непрерывный (С++17)  ( LegacyContiguousIterator)
- Диапазон итераторов `[first, last)`
- Корректный диапазон
- Начиная с С++20, требования к итераторам основаны на концептах (с ними мы познакомимся позже), а не Named requirements

## Входной итератор


```cpp
template <typename InputIterator, typename T>
InputIterator find(InputIterator first, InputIterator last, const T& value) {
    while (first != last && *first != value) {
        ++first;
    }
    return first;
}
```

## Входной итератор


- Требования:
- operator !=
- ++iterator и iterator++
- value  = *iterator
- operator ==
- O(1)

## Выходной итератор


```cpp
template <typename InputIterator, typename OutputIterator>
OutputIterator copy(InputIterator first, InputIterator last, OutputIterator result) {
    while (first != last) {
        *result = *first;
        ++first;
        ++result;
    }

    return result;
}
```

## Выходной итератор


- Требования:
- *iterator = value
- ++iterator и iterator++
- O(1)

## Однонаправленные итераторы


- Входной итератор
- Выходной итератор
- Сохранение для последующего использования

## Однонаправленные итераторы


```cpp
template <typename ForwardIterator, typename T>
void replace(ForwardIterator first, ForwardIterator last, const T& old_value, const T& new_value) {
    while (first != last) {
        if (*first == old_value) {
            *first = new_value;
        }

        ++first;
    }
}
```

## Двунаправленные итераторы


```{.cpp filename="reverse-iterators.cpp"}
{{< include examples/13-stl-containers-iterators-algorithms/reverse-iterators.cpp >}}
```

[![](assets/compiler-explorer.svg){.godbolt-link-image width="32"}][godbolt-13-reverse-iterators]{aria-label="Open in Compiler Explorer"}

## Двунаправленные итераторы


- Однонаправленный
- operator--

## Итераторы с произвольным доступом


```cpp
std::vector<int> v;
// …. Заполнение вектора
bool b = std::binary_search(v.begin(), v.end(), 6);
```

## Итераторы с произвольным доступом


- Двунаправленный итератор
- Достижение любой позиции за O(1)
- Пусть r и s – итераторы с произвольным доступом, n – целое число , тогда:
- r+n, n+r, r-n
- r[n]=*(r+n)
- r+=n, r-=n
- `r - s` возвращает разность итераторов
- `r < s`, `r > s`, `r <= s`, `r >= s` возвращают `bool`

## Непрерывный итератор


- итератор произвольного доступа
```cpp
*(a + n) = *(std::addressof(*a) + n)
```

## Входные итераторы


- Выходные итераторы
- Однонаправленные итераторы
- Двунаправленное итераторы
- Итераторы с произвольным доступом
- Непрерывный итератор
- Иерархия требований

## Итераторы


- Описание контейнеров включает описание предоставляемых ими итераторов
- Описание обобщённых алгоритмов включает категории итераторов, с которыми они работают
- Вывод:
- Интерфейсы контейнеров и алгоритмов STL спроектированы так, чтобы поддерживать эффективные комбинации и препятствовать неэффективным

## iterator / const_iterator


```cpp
const vector<int> v(100, 0);

// vector<int>::iterator i = v.cbegin();  // !! Error

vector<int>::const_iterator i = v.cbegin();
```

## Итератор


| Контейнер | Итератор | Доступ | Категория |
|---|---|---|---|
| `T[N]` | `T*` | изменяемый | непрерывный |
| `const T[N]` | `const T*` | константный | непрерывный |
| `std::vector<T>` | `iterator` / `const_iterator` | изм. / конст. | непрерывный |
| `std::deque<T>` | `iterator` / `const_iterator` | изм. / конст. | произвольный |
| `std::list<T>` | `iterator` / `const_iterator` | изм. / конст. | двунаправленный |

## Итераторы


| Контейнер | Итератор | Доступ | Категория |
|---|---|---|---|
| `std::set<T>` | `iterator` / `const_iterator` | константный | двунаправленный |
| `std::multiset<T>` | `iterator` / `const_iterator` | константный | двунаправленный |
| `std::map<Key, T>` | `iterator` / `const_iterator` | изм. value / конст. | двунаправленный |
| `std::multimap<Key, T>` | `iterator` / `const_iterator` | изм. value / конст. | двунаправленный |

## Итераторы


| Контейнер | Итератор | Доступ | Категория |
|---|---|---|---|
| `std::unordered_set<T>` | `iterator` / `const_iterator` | константный | однонаправленный |
| `std::unordered_multiset<T>` | `iterator` / `const_iterator` | константный | однонаправленный |
| `std::unordered_map<Key, T>` | `iterator` / `const_iterator` | изм. value / конст. | однонаправленный |
| `std::unordered_multimap<Key, T>` | `iterator` / `const_iterator` | изм. value / конст. | однонаправленный |

## Обобщенные алгоритмы


- Неизменяющие алгоритмы
- Изменяющие алгоритмы
- Связанные с сортировкой алгоритмы
- Обобщенные числовые алгоритмы

## Алгоритмы с предикатами


```cpp
template <class Type>
struct greater {
    bool operator()(const Type& _Left, const Type& _Right) const;
};

int main() {
    std::vector<int> v1;
    for (int i = 0; i < 8; i++) v1.push_back(rand());

    std::sort(v1.begin(), v1.end(), greater<int>());
}
```

- Типы аргументов шаблонизированы, поэтому может быть функциональный объект или функция

## find


- adjacent_find
- count
- for_each
- mismatch
- equal
- search
- Неизменяющие алгоритмы

## find и find_if


```cpp
class GreaterThan50 {
   public:
    bool operator()(int x) const {
        return x > 50;
    }
};

int main() {
    std::vector<int> v;
    for (int i = 0; i < 13; ++i) v.push_back(i * i);

    std::vector<int>::iterator where;
    where = find_if(v.begin(), v.end(), GreaterThan50());

    assert(*where == 64);
    return 0;
}
```

## count


- Задача: поиск количества значений равных данному
- Сложность:  линейная
```cpp
int main() {
    std::vector<int> v{0, 0, 1, 1, 1, 2, 2, 2};
    std::cout << count(v.begin(), v.end(), 1) << std::endl;

    int arr[]{1, 2, 3, 4, 5, 6, 7, 8};
    std::cout << std::count_if(arr, arr + 8, even{}) << std::endl;

    return 0;
}
```

## Изменяющие алгоритмы


- copy
- copy_backward
- fill
- generate
- partition
- shuffle
- remove
- replace
- rotate
- swap
- swap_ranges
- transform
- unique

## fill \ fill_n


```cpp
int main() {
    std::vector<int> v1;
    for (int i = 0; i <= 9; i++) v1.push_back(5 * i);

    fill(v1.begin() + 5, v1.end(), 2);

    fill_n(v1.begin() + 7, 3, 2);
}
```

## generate


- Задача: Заполняет диапазон значениями генерируемыми подставленной функцией
- Сложность: линейная
```cpp
template <typename T>
class calc_square {
    T i;

   public:
    calc_square() : i(0) {
    }
    T operator()() {
        ++i;
        return i * i;
    }
};

int main() {
    std::vector<int> v(10);
    std::generate(v.begin(), v.end(), calc_square<int>());
}
```

## erase-remove idiom


```cpp
int main() {
    std::vector<int> vec = {1, 2, 0, 3, 4, 0, 5, 6, 7, 0, 8};

    std::vector<int>::iterator new_end = std::remove(vec.begin(), vec.end(), 0);

    vec.erase(new_end, vec.end());
}
```

## Теоретико-множественные операции


- includes
- set_union
- set_intersection
- set_difference
- set_symmetric_difference

## `std::includes`


- Задача: проверить, содержатся ли элементы одного сортированного диапазона в другом
```cpp
int main() {
    bool result;

    std::vector<char> v1 = to_vector("abcde");
    std::vector<char> v2 = to_vector("aeiou");

    result = std::includes(v1.begin(), v1.end(), v2.begin(), v2.end());
    result = std::includes(v1.begin(), v1.end(), v2.begin(), v2.begin() + 2);

    return 0;
}
```

## set_union


```cpp
int main() {
    std::vector<char> v1 = to_vector("abcde");
    std::vector<char> v2 = to_vector("aeiou");

    std::vector<char> setUnion;
    std::set_union(v1.begin(), v1.end(), v2.begin(), v2.end(), back_inserter(setUnion));

    return 0;
}
```

## Обобщенные числовые алгоритмы


- accumulate
- partial_sum
- adjacent_difference
- inner_product

## accumulate


```cpp
int main() {
    std::vector<int> v1, v2(20);
    for (int i = 1; i < 21; i++) v1.push_back(i);

    int total = std::accumulate(v1.begin(), v1.end(), 0);
    int ptotal = std::accumulate(v1.begin(), v1.end(), 1, std::multiplies<int>());
}
```

- Бинарный оператор параметризуется

## inner_product


- Задача: Получить скалярное произведение  двух диапазонов
```cpp
int main() {
    int x1[5], x2[5];
    for (int i = 0; i < 5; ++i) {
        x1[i] = i + 1;
        x2[i] = i + 2;
    }

    int result = std::inner_product(&x1[0], &x1[5], &x2[0], 0);

    result =
        std::inner_product(&x1[0], &x1[5], &x2[0], 1, std::multiplies<int>(), std::plus<int>());
}
```

[godbolt-13-reverse-iterators]: <https://godbolt.org/#g:!((g:!((h:codeEditor,i:(j:1,lang:c%2B%2B,options:(compileOnChange:'0'),source:'%23include+%3Calgorithm%3E%0A%23include+%3Ciostream%3E%0A%23include+%3Clist%3E%0A%0Aint+main()+%7B%0A++++int+values%5B%5D+%3D+%7B12,+3,+25,+7,+11,+213,+7,+123,+29,+-3%7D%3B%0A++++std::reverse(std::begin(values),+std::end(values))%3B%0A%0A++++std::list%3Cint%3E+numbers(std::begin(values),+std::end(values))%3B%0A++++std::reverse(numbers.begin(),+numbers.end())%3B%0A%0A++++for+(int+number+:+numbers)+%7B%0A++++++++std::cout+%3C%3C+number+%3C%3C+!'+!'%3B%0A++++%7D%0A++++std::cout+%3C%3C+!'%5Cn!'%3B%0A%0A++++return+0%3B%0A%7D%0A'),l:'5'),(h:executor,i:(compilationPanelShown:'0',compiler:clang2310,compilerOutShown:'0',lang:c%2B%2B,libs:!(),options:'-std%3Dc%2B%2B20+-O0',source:1,tree:0),l:'5')),l:'2')),version:4>
<!-- godbolt source="examples/13-stl-containers-iterators-algorithms/reverse-iterators.cpp" compiler="clang2310" options="-std=c++20 -O0" -->
