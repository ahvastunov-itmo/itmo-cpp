---
title: "Лекция 12. Шаблоны — II"
---

::: {.content-visible unless-format="revealjs"}

[Открыть слайды](slides/12-templates-ii.html){.btn .btn-outline-primary target="_blank"}

:::

## Язык С++


- Template specialization. Smart Ptr

## Специализация шаблона класса


```cpp
template <class T>
struct Boo {
    void foo() {
        std::cout << "foo" << std::endl;
    }
};

template <>
struct Boo<int> {
    void foo() {
        std::cout << "foo(int)" << std::endl;
    }
};
```

## Full template specialization


- Шаблон функции
- Шаблон класса
- Шаблон переменной
- Шаблона функции класса
- Шаблона члена класса
- ….

## Специализация шаблона класса


```cpp
template <class T>
struct Boo {
    void foo() {
        std::cout << "foo" << std::endl;
    }
    void func() {};
};

template <>
struct Boo<int> {
    void foo() {
        std::cout << "foo(int)" << std::endl;
    }
};
```

## Специализация шаблона класса


```cpp
int main() {
    std::vector<bool> bv;
    std::vector<int> bi;
    return 0;
}
```

## Специализация шаблона класса


```cpp
template <class T>
struct is_float {
    static bool value() {
        return false;
    }
};

template <>
struct is_float<float> {
    static bool value() {
        return true;
    }
};

template <class T>
static bool is_float_v = is_float<T>::value();
```

## Специализация шаблонов функций


```cpp
template <class T>
void swap(T& a, T& b) {
    T tmp = a;
    a = b;
    b = tmp;
}

struct SomeStruct {};
```

## Специализация шаблонов функций


```cpp
template <>
void swap<SomeStruct>(SomeStruct& a, SomeStruct& b) {
    std::cout << "swap for SomeStruct with template" << std::endl;
}

void swap(SomeStruct& a, SomeStruct& b) {
    std::cout << "swap for SomeStruct without template" << std::endl;
}
```

## Специализация шаблонов функций


```cpp
template <class T>
void swap(std::vector<T>& x, std::vector<T>& y) {
    std::cout << "vector swap" << std::endl;
    x.swap(y);
};
```

## Специализация шаблонного члена класса


```cpp
struct SomeStruct {
    template <class T>
    void func(const T& x) {
        std::cout << x << std::endl;
    }

    void func(int x) {
        std::cout << "int" << std::endl;
    }
};
```

## Частичная специализация


```cpp
template <class T, class U>
struct Boo {
    void foo() {
        std::cout << "A" << std::endl;
    }
    void func() {};
};

template <class U>
struct Boo<int, U> {
    void foo() {
        std::cout << "B" << std::endl;
    }
};

template <>
struct Boo<int, int> {
    void foo() {
        std::cout << "C" << std::endl;
    }
};
```

## RAII


- Resource acquisition is initialization
- Захват ресурса - есть инициализация
- Обеспечивает инкапсуляцию ресурса и поддержание инварианта
- Обеспечивает безопасность при исключениях для объектов, лежащих на стеке
- Применяется для указателей, мьютексов, файлов и других ресурсов

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

## auto_ptr


```cpp
struct Boo {
    Boo() {
        std::cout << "Boo()\n";
    }
    ~Boo() {
        std::cout << "~Boo()\n";
    }
};

void func() {
    Boo* b = new Boo();
    throw std::runtime_error("Error");
    delete b;
}
```

## auto_ptr


```cpp
template <class T>
class auto_ptr {
   public:
    auto_ptr(T* ptr = nullptr) : ptr_(ptr) {
    }

    ~auto_ptr() {
        delete ptr_;
    }

   private:
    T* ptr_;
};
```

- auto_ptr владеет указателем, отвечает за время его жизни

## auto_ptr


```cpp
void func() {
    auto_ptr<Boo> b{new Boo()};
    throw std::runtime_error("Error");
}

int main() {
    try {
        func();
    } catch (std::exception& e) {
        std::cerr << e.what() << std::endl;
    }
    return 0;
}
```

## auto_ptr


```cpp
void func() {
    auto_ptr<Boo> b{new Boo()};
    auto_ptr<Boo> p = b;
    throw std::runtime_error("Error");
}
auto_ptr(auto_ptr& other) : ptr_(other.release()) {
}

T* release() {
    T* tmp = ptr_;
    ptr_ = nullptr;
    return tmp;
}
```

- При копировании, владение передаётся другому объекту

## auto_ptr


```cpp
void func() {
    auto_ptr<Boo> a{new Boo()};
    auto_ptr<Boo> b{new Boo()};
    a = b;
    throw std::runtime_error("Error");
}

auto_ptr& operator=(auto_ptr& other) {
    if (ptr_ != other.ptr_) {
        delete ptr_;
        ptr_ = other.release();
    }
}
```

## auto_ptr


```cpp
void func() {
    auto_ptr<Boo> a{new Boo()};

    a->func();
    (*a).func();

    throw std::runtime_error("Error");
}

T* operator->() const {
    return ptr_;
}
T& operator*() const {
    return ptr_;
}
```

## auto_ptr


- В `<memory>` был объявлен `std::auto_ptr`
- deprecated in C++11
- removed in C++17

## auto_ptr


```cpp
int main() {
    auto_ptr<Boo> b{new Boo()};
    std::vector<auto_ptr<Boo>> boos(1);

    boos[0] = b;
    boos[0]->func();
    auto_ptr<Boo> a = boos[0];
    a->func();

    // b->func();        // Segmentation fault
    // boos[0]->func();  // Segmentation fault

    return 0;
}
```

## Smart Pointer


- unique_ptr
- shared_ptr
- weak_ptr

## unique_ptr


- Во многом похож на auto_ptr
- Нет конструктора копирования
- Нет оператора присваивания
- make_unique
- deleter
```cpp
std::default_deleter
```

## unique_ptr


```cpp
struct FileDeleter {
    void operator()(FILE* file) {
        if (file != nullptr) {
            fclose(file);
            file = nullptr;
        }
    }
};

int main() {
    std::unique_ptr<FILE, FileDeleter> f{fopen("temp.txt", "w")};
    return 0;
}
```

## std::shared_ptr


- Атомарный счётчик
- Копирование увеличивает счётчик
- Деструктор уменьшает
- Уничтожение при счётчике = 0
```cpp
std::make_shared
```

## std::shared_ptr


```cpp
void func() {
    std::shared_ptr<Boo> p1 = std::make_shared<Boo>();
    std::shared_ptr<Boo> p2 = p1;

    p1->func();
    p2->func();

    std::cout << p1.use_count() << std::endl;
}
```

## std::shared_ptr


```cpp
struct A;

struct B {
    B() {
        std::cout << "B\n";
    }
    ~B() {
        std::cout << "~B\n";
    }
    std::shared_ptr<A> ptr;
};

struct A {
    A() {
        std::cout << "A\n";
    }
    ~A() {
        std::cout << "~A\n";
    }
    std::shared_ptr<B> ptr;
};

void func() {
    std::shared_ptr<A> a{new A()};
    std::shared_ptr<B> b{new B()};
    a->ptr = b;
    b->ptr = a;
    // nothing will be deleted
}
```

## std::weak_ptr


- Не владеет объектом
- Может вернуть `shared_ptr` через `lock()`
- Позволяет узнать количество владельцев через `use_count()`
- expired
- bad_weak_ptr

## std::enable_shared_from_this


- CRTP
- Позволяет создать shared_ptr внутри методов объектов в shared_ptr
- Кидает bad_weak_ptr если объект не shared_ptr
