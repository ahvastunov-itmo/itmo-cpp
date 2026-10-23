---
title: "Квиз: Умные указатели"
description: "Десять вопросов с объяснениями по теме «Умные указатели»."
page-navigation: false
toc: false
format:
  html:
    css:
      - ../styles.css
      - ../assets/quizzes/quiz.css
    include-after-body:
      text: |
        <script src="../assets/quizzes/quiz.js" defer></script>
---

::: {.quiz-intro}

**C++20 · 10 вопросов · около 10 минут**

Выберите ответ и проверьте себя. После каждого вопроса появится объяснение, в конце — результат и полный разбор. В вопросах с несколькими ответами нужно выбрать все верные варианты: за каждый полностью верный ответ начисляется один балл.

[Открыть лекцию](../lectures/smart-pointers.md){.btn .btn-outline-primary target="_blank"}

:::

::::: {.course-quiz}

<p class="quiz-fallback">Без интерактивной проверки можно пройти вопросы самостоятельно: варианты ответа перечислены под каждым вопросом, разбор открывается по нажатию «Ответ и объяснение».</p>

:::: {.quiz-question data-answer="3"}

## Передача unique_ptr

Непустой `std::unique_ptr<int> p` перемещают в новый `q`. Каково состояние после успешного перемещения?

::: {.quiz-options}
1. Оба пусты, объект всегда удалён.
2. Оба независимо владеют одним объектом.
3. `q` владеет объектом, `p` пуст.
4. `p` владеет объектом, `q` пуст.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Владение перешло к `q`, а `p` пуст.** Для `unique_ptr` это конкретная гарантия, более сильная, чем общее «допустимое, но неуточнённое состояние» после перемещения.

[Повторить: unique_ptr](../lectures/smart-pointers.md#unique_ptr){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Сырой адрес

Что означает сырой указатель, полученный через `p.get()` у `unique_ptr`?

::: {.quiz-options}
1. Новый независимый владелец.
2. Невладеющий доступ к тому же объекту без передачи владения.
3. Автоматическую передачу владения вызывающему коду.
4. Копию объекта.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`get()` возвращает адрес, сохраняя владельца.** Самостоятельный `delete` по этому адресу нарушил бы управление ресурсом.

[Повторить: unique_ptr](../lectures/smart-pointers.md#unique_ptr){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Копирование shared_ptr

Есть один непустой `shared_ptr`, других владельцев нет. Его копируют во второй `shared_ptr`. Сколько сильных владельцев теперь?

::: {.quiz-options}
1. `2`.
2. `1`.
3. Число зависит от размера объекта.
4. `0`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Два владельца одного объекта.** Копирование `shared_ptr` разделяет владение, а не копирует управляемый объект.

[Повторить: std::shared_ptr](../lectures/smart-pointers.md#stdshared_ptr){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## Последний владелец

Что происходит с управляемым объектом, когда исчезает последний сильный владелец `shared_ptr`?

::: {.quiz-options}
1. Объект живёт, пока существует любой `weak_ptr`.
2. Он становится глобальным.
3. Он уничтожается через связанный механизм удаления.
4. Он обязательно копируется в стек.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Объект уничтожается.** Контрольный блок при наличии слабых ссылок может сохраняться дольше, но это не продлевает жизнь самого объекта.

[Повторить: std::shared_ptr](../lectures/smart-pointers.md#stdshared_ptr){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Цикл владения

Два объекта хранят друг на друга `shared_ptr`, внешние владельцы исчезли. В чём риск?

::: {.quiz-options}
1. Цикл сильных ссылок сохранит объекты.
2. Указатели автоматически станут `weak_ptr`.
3. Оба объекта обязательно удалятся сразу.
4. Компилятор всегда запретит такую структуру.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Возникает цикл сильного владения.** Для связи, которая не должна владеть объектом, используют `weak_ptr` или другой невладеющий интерфейс.

[Повторить: std::weak_ptr](../lectures/smart-pointers.md#stdweak_ptr){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## lock у weak_ptr

Что вернёт `weak_ptr::lock()`, если управляемый объект уже уничтожен?

::: {.quiz-options}
1. Висячий сильный владелец.
2. Пустой `shared_ptr`.
3. Новый объект, созданный автоматически.
4. `unique_ptr` с копией старого объекта.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Пустой `shared_ptr`.** Результат `lock()` нужно проверить; успешный результат удерживает объект в течение своего времени жизни.

[Повторить: std::weak_ptr](../lectures/smart-pointers.md#stdweak_ptr){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Счётчик и потоки

Делает ли совместное владение через разные `shared_ptr` сам управляемый объект безопасным для одновременной записи?

::: {.quiz-options}
1. Да, если объект имеет метод `get`.
2. Нет, доступ к данным объекта требует собственной синхронизации.
3. Да, если владельцев ровно два.
4. Да, любая операция объекта становится атомарной.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Потокобезопасность счётчика не равна потокобезопасности объекта.** Конфликтующий доступ к данным нужно защищать отдельно.

[Повторить: std::shared_ptr](../lectures/smart-pointers.md#stdshared_ptr){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## shared_from_this

Зачем объекту наследоваться от подходящего `enable_shared_from_this<T>` при владении через `shared_ptr`?

::: {.quiz-options}
1. Чтобы владение стало единоличным.
2. Чтобы получать `shared_ptr`, разделяющий уже существующее владение.
3. Чтобы автоматически запретить наследование.
4. Чтобы создавать новый независимый контрольный блок при каждом вызове.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Для разделения существующего владения.** Создавать независимый `shared_ptr` из `this` опасно: можно получить два несогласованных владельца и двойное удаление.

[Повторить: std::enable_shared_from_this](../lectures/smart-pointers.md#stdenable_shared_from_this){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Без установленного владельца

Объект с `enable_shared_from_this` ещё не связан с управляющим `shared_ptr`. Что произойдёт при `shared_from_this()` в C++20?

::: {.quiz-options}
1. Будет выброшено `std::bad_weak_ptr`.
2. Всегда создастся новый владелец.
3. Метод обязательно вернёт сырой указатель.
4. Вернётся `unique_ptr`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Будет `std::bad_weak_ptr`.** Наличие базового класса само по себе не создаёт разделяемое владение.

[Повторить: std::enable_shared_from_this](../lectures/smart-pointers.md#stdenable_shared_from_this){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1 2 3"}

## Другие ресурсы

К каким ресурсам применима идея RAII, кроме динамической памяти? Выберите все верные варианты.

::: {.quiz-options}
1. Открытые файлы.
2. Захваченные мьютексы.
3. Другие ресурсы с определённой операцией освобождения.
4. Только объекты типа `int`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**К файлам, блокировкам и другим ресурсам.** Важна связь захвата и освобождения с жизнью объекта-обёртки, а не конкретный вид ресурса.

[Повторить: RAII](../lectures/smart-pointers.md#raii){target="_blank"}

</details>

::::

:::::


Дополнительно: [Наблюдатели unique_ptr в проекте стандарта C++20](https://timsong-cpp.github.io/cppwp/n4861/unique.ptr.single.observers).
