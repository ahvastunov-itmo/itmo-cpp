---
title: "Лекция 8. Перегрузка операторов"
---

::: {.content-visible unless-format="revealjs"}

[Открыть слайды](slides/08-operator-overloading.html){.btn .btn-outline-primary target="_blank"}

:::

## Язык С++


- Перегрузка операторов

## Операторы


- Арифметические ∙
- Унарные: префиксные + - ++ --,
- постфиксные ++ -- ∙
- Бинарные: + - * / % += -= *= /= %=
- Битовые ∙
- Унарные: ~. ∙
- Бинарные: & | ^ &= |= ^= >> << >>= <<=.
- Логические ∙
- Унарные: !. ∙
- Бинарные: && ||. ∙
- Сравнения: == != > < >= <=

## Операторы


- Оператор присваивания: =
- Специальные:
- префиксные: `*`, `&`
- постфиксные: `->`, `->*`
- особые: `.`, `::`
- Скобки: [] ()
- Оператор приведения (type)
- Тернарный оператор: x ? y : z
- Работа с памятью: new new[] delete delete[]

## Перегрузка операторов


- Не должна противоречить здравой логике
- Как член класса или как глобальная функция
- `[]`, `()`, `->`, `=` всегда перегружаются как члены класса
- Ввод `>>` и вывод `<<` обычно перегружаются как глобальные функции
- Операторы `::`, `.*`, `.`, `?:` перегружать нельзя

- Новые операторы сделать нельзя

## Оператор | Как член класса | Не как член класса


- @a | (a).operator@ ( ) | operator@ (a)
- a@b | (a).operator@ (b) | operator@ (a, b)
- a=b | (a).operator= (b) |
- a(b...) | (a).operator()(b...) |
- `a[b] | (a).operator[](b) |`
```cpp
a->| (a).operator->() |
```

- a@ | (a).operator@ (0) | operator@ (a, 0)

## CRational


- Класс из предыдущей лекции
```cpp
class CRational {
   public:
    int numerator() const {
        return numerator_;
    }

    unsigned denominator() const {
        return denominator_;
    }

   private:
    int numerator_;
    unsigned denominator_;
};
```

## CRational


```cpp
CRational& operator=(const CRational& other) {
    if (&other == this) {
        return *this;
    }

    numerator_ = other.numerator_;
    denominator_ = other.denominator_;

    return *this;
}
```

## CRational


```cpp
std::ostream& operator<<(std::ostream& stream, const CRational& value) {
    stream << value.numerator() << '/' << value.denominator();
    return stream;
}
```

- Операторы ввода/вывода:
- operator<< & operator>>
- Не как члены класса

## CRational


```cpp
std::istream& operator>>(std::istream& stream, CRational& r) {
    int a;
    unsigned b;
    char ch;
    stream >> a;

    if (stream.get() != '/') stream.setstate(std::ios::failbit);
    stream >> b;

    r = CRational(a, b);
    return stream;
}
```

## CRational


```cpp
bool operator==(const CRational& lhs, const CRational& rhs) {
    return lhs.numerator() * rhs.denominator() == rhs.numerator() * lhs.denominator();
}
bool operator!=(const CRational& lhs, const CRational& rhs) {
    return !operator==(lhs, rhs);
}
```

## CRational


- bool operator<(const CRational& lhs, const CRational& rhs) {
```cpp
return lhs.numerator() * rhs.denominator() < rhs.numerator() * lhs.denominator();
}
bool operator>(const CRational& lhs, const CRational& rhs) {
    return (rhs < lhs);
}
bool operator<=(const CRational& lhs, const CRational& rhs) {
    return !operator>(lhs, rhs);
}
```

## CRational


- // prefix operator
- CRational& operator++() {
```cpp
numerator_ += denominator_;
return *this;
}
// postfix operator
CRational operator++(int) {
    CRational tmp(*this);
    operator++();
    return tmp;
}
```

## CRational


```cpp
explicit operator float() const {
    return numerator_ / denominator_;
}
```

## friend


```cpp
class CRational {
   public:
    friend std::ostream& operator<<(std::ostream& stream, const CRational& value);
};

std::ostream& operator<<(std::ostream& stream, const CRational& value) {
    stream << value.numerator_ << '/' << value.denominator_;
    return stream;
}
```

## CIntArray


```cpp
class CIntArray {
   public:
    // …
    `int& operator[](size_t idx) {
        ` return data_[xidx];
    }

   private:
    int* data_;
    size_t size_;
};
```

## Functor or functional object


```cpp
class CMult {
   public:
    explicit CMult(int mult) : mult_(mult) {
    }
    int operator()(int value) {
        return mult_ * value;
    }

   private:
    int mult_;
};
```

## operator()


```cpp
int main() {
    CMult m(2);
    std::cout << m(3);

    std::vector<int> data = {1, 2, 3, 4, 5};
    std::transform(data.begin(), data.end(), data.begin(), CMult(5));

    return 0;
}
```

## RAII (Resource Acquisition Is Initialization)


```cpp
class CFileDescriptor {
   public:
    explicit CFileDescriptor(const char* path, const char* mode) {
        file_ = fopen(path, mode);
        if (file_ == nullptr) {
            // throw some exception (see next lection)
        }
    }
    operator FILE*() {
        return file_;
    }
    ~CFileDescriptor() {
        if (file_ != nullptr) fclose(file_);
    }

   private:
    FILE* file_;
};
```

## operator->, operator*


```cpp
class Foo {
   public:
    int foo() const {
        return value_;
    }

   private:
    int value_ = 2025;
};
```

## RAII (Resource Acquisition Is Initialization)


```cpp
class FooPtr {
   public:
    explicit FooPtr(Foo* ptr = nullptr) : ptr_(ptr) {
    }

    ~FooPtr() {
        delete ptr_;
    }

   private:
    Foo* ptr_;
};
```

## operator->, operator*


```cpp
class FooPtr {
   public:
    Foo& operator*() {
        return *ptr_;
    }

    Foo* operator->() {
        return ptr_;
    }

   private:
    Foo* ptr_;
};
```

## operator->, operator*


```cpp
int main() {
    FooPtr p{new Foo()};
    if (p->foo() == 2025) return 1;

    return 0;
}
```
