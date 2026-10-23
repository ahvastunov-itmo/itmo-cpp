---
title: "Квиз: Приведения типов и CRTP"
description: "Десять вопросов с объяснениями по теме «Приведения типов и CRTP»."
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

[Открыть лекцию](../lectures/17-casts-crtp.md){.btn .btn-outline-primary target="_blank"}

:::

::::: {.course-quiz}

<p class="quiz-fallback">Без интерактивной проверки можно пройти вопросы самостоятельно: варианты ответа перечислены под каждым вопросом, разбор открывается по нажатию «Ответ и объяснение».</p>

:::: {.quiz-question data-answer="4"}

## Явное числовое преобразование

Какой именованный cast подходит для явного числового преобразования `double` в `int`, если значение представимо после усечения?

::: {.quiz-options}
1. `dynamic_cast`.
2. `reinterpret_cast`.
3. `const_cast`.
4. `static_cast`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`static_cast<int>(value)`.** Дробная часть отбрасывается; корректность диапазона значения всё равно нужно учитывать.

[Повторить: static_cast](../lectures/17-casts-crtp.md#static_cast){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## Снятие const

Какой cast предназначен для изменения cv-квалификаторов указателей и ссылок?

::: {.quiz-options}
1. `reinterpret_cast`.
2. Только `std::move`.
3. `const_cast`.
4. `dynamic_cast`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`const_cast`.** Само снятие квалификатора не означает, что исходный объект разрешено изменять.

[Повторить: const_cast](../lectures/17-casts-crtp.md#const_cast){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Исходно константный объект

Объект объявлен `const int`. После снятия `const` из указателя в него записывают новое значение. Как оценить запись?

::: {.quiz-options}
1. Неопределённое поведение.
2. Автоматическое создание копии.
3. Всегда корректное изменение.
4. Обязательно ошибка компиляции именно на присваивании.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Изменение исходно константного объекта — неопределённое поведение.** Это анализ ошибки; `const_cast` не меняет свойства исходного объекта.

[Повторить: const_cast](../lectures/17-casts-crtp.md#const_cast){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="2"}

## Проверяемый downcast

Нужно проверить во время выполнения, указывает ли `Base*` на подходящий `Derived`; база полиморфная. Что использовать?

::: {.quiz-options}
1. Только C-style cast.
2. `dynamic_cast<Derived*>`.
3. `const_cast`.
4. `reinterpret_cast`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**`dynamic_cast` выполняет проверку.** При выполнении требований к иерархии он позволяет безопасно проверить динамический тип.

[Повторить: dynamic_cast](../lectures/17-casts-crtp.md#dynamic_cast){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Неуспешное приведение указателя

Каков результат неуспешного `dynamic_cast<Derived*>(base_ptr)` при корректно заданных полиморфных типах?

::: {.quiz-options}
1. Произвольный ненулевой адрес.
2. Всегда `std::terminate`.
3. Копия объекта `Derived`.
4. Нулевой указатель.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Результат — `nullptr`.** Его нужно проверить перед использованием объекта как `Derived`.

[Повторить: dynamic_cast](../lectures/17-casts-crtp.md#dynamic_cast){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## Неуспешное приведение ссылки

Что происходит, если проверяемое `dynamic_cast<Derived&>(base_ref)` не удаётся?

::: {.quiz-options}
1. Всегда возвращается сама база.
2. Возвращается «нулевая ссылка».
3. Выбрасывается `std::bad_cast`.
4. Создаётся новый объект `Derived`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Выбрасывается `std::bad_cast`.** В отличие от указателя, ссылка не имеет нулевого значения для обозначения неудачи.

[Повторить: dynamic_cast](../lectures/17-casts-crtp.md#dynamic_cast){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## Непроверяемый downcast

Проверяет ли `static_cast<Derived*>(base_ptr)` фактический динамический тип объекта?

::: {.quiz-options}
1. Да, но только для пустых классов.
2. Да, только в Release.
3. Да, как `dynamic_cast`.
4. Нет, корректность такого downcast должен обеспечить код.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Проверки во время выполнения нет.** Для неподходящего объекта такое приведение не становится безопасным; при необходимости проверки используют `dynamic_cast`.

[Повторить: static_cast](../lectures/17-casts-crtp.md#static_cast){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="3"}

## reinterpret_cast

Даёт ли `reinterpret_cast` произвольного указателя право безопасно читать память как любой другой тип?

::: {.quiz-options}
1. Да, все ограничения типов исчезают.
2. Да, если адрес ненулевой.
3. Нет: правила выравнивания, времени жизни и допустимого доступа остаются.
4. Да, если тип короче по имени.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Cast не отменяет правил доступа к объекту.** Низкоуровневое преобразование указателя само по себе не создаёт объект требуемого типа.

[Повторить: reinterpret_cast](../lectures/17-casts-crtp.md#reinterpret_cast){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="1"}

## Форма CRTP

Какая запись выражает характерную структуру CRTP?

::: {.quiz-options}
1. `Derived : Base<Derived>`.
2. `Derived : Derived`.
3. `Base : Derived<Base>`.
4. `Base = Derived*`.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Производный класс передаёт себя аргументом шаблона базы.** Базовый шаблон может использовать этот тип при реализации общего поведения.

[Повторить: Curiously Recurring Template Pattern](../lectures/17-casts-crtp.md#curiously-recurring-template-pattern){target="_blank"}

</details>

::::

:::: {.quiz-question data-answer="4"}

## CRTP и полиморфизм

Какой вид полиморфизма обычно реализуют с помощью CRTP?

::: {.quiz-options}
1. Только динамический через обязательную vtable.
2. Только полиморфизм исключений.
3. Полиморфизм, выбираемый пользователем после завершения программы.
4. Статический, через шаблонную связь с производным типом.
:::

<details class="quiz-explanation">
<summary>Ответ и объяснение</summary>

**Статический полиморфизм.** Выбор реализации может определяться типами при компиляции, без обязательного виртуального вызова.

[Повторить: Curiously Recurring Template Pattern](../lectures/17-casts-crtp.md#curiously-recurring-template-pattern){target="_blank"}

</details>

::::

:::::
