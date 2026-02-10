# 🏋️‍♂️ TunderLab

**TunderLab** é uma plataforma web moderna para gerenciamento de treinos, conectando Personal Trainers aos seus alunos. O sistema permite que o personal crie cronogramas de exercícios personalizados e que os alunos visualizem suas atividades diárias através de uma interface intuitiva e responsiva.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído com uma stack moderna focada em performance e experiência do desenvolvedor:

* **Frontend Framework:** [Vue.js 3](https://vuejs.org/) (Composition API)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **UI Library:** [Vuetify 3](https://vuetifyjs.com/)
* **State Management:** [Pinia](https://pinia.vuejs.org/)
* **Roteamento:** [Vue Router](https://router.vuejs.org/) (com `unplugin-vue-router`)
* **Backend as a Service:** [Supabase](https://supabase.com/) (Auth, Database, Realtime)
* **Linter:** [ESLint](https://eslint.org/)

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (Versão 18+ recomendada)
* [NPM](https://www.npmjs.com/) ou Yarn

---

## 🔧 Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/tunderlab.git](https://github.com/seu-usuario/tunderlab.git)
    cd tunderlab
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configuração de Ambiente (.env):**
    Crie um arquivo `.env` na raiz do projeto com as chaves do seu projeto Supabase:

    ```env
    VITE_SUPABASE_URL=sua_url_do_supabase
    VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
    ```

4.  **Execute o projeto:**
    ```bash
    npm run dev
    ```
    O app estará disponível em `http://localhost:3000`.

---

## 🗄️ Setup do Banco de Dados (Supabase)

Para que o sistema de Login (Personal vs Aluno) e Tarefas funcione, execute os comandos SQL abaixo no **SQL Editor** do seu painel Supabase.

### 1. Estrutura de Tabelas
```sql
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text
);


create table public.students (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null unique,
  phone text,
  personal_id uuid references auth.users not null
);

create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  day_of_week text,
  student_id uuid references public.students not null
);
```
### 2. Automação de Cadastro (Triggers)

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  if exists (select 1 from public.students where email = new.email) then
    return new;
  else
    insert into public.profiles (id, email, full_name)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name');
    return new;
  end if;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 3. Políticas de Segurança (RLS)
```sql
alter table public.students enable row level security;
alter table public.tasks enable row level security;

create policy "Aluno vê perfil" on public.students for select
using (email = auth.jwt() ->> 'email');

create policy "Aluno vê tarefas" on public.tasks for select
using (student_id in (select id from public.students where email = auth.jwt() ->> 'email'));
```
---

## 🧪 Testes Automatizados
Este projeto está configurado para utilizar testes unitários e testes de sistema (E2E).

### 1. Testes Unitários (Unit Tests)
Utilizamos Vitest para testar a lógica das Stores (Pinia) e funções isoladas.

Instalação das ferramentas (caso não tenha):
```bash
npm install -D vitest
```
Comando para rodar:
```bash
npm run test:unit
```
Exemplo de teste:
```bash
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Auth Store', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('deve iniciar com usuário nulo', () => {
    const auth = useAuthStore()
    expect(auth.user).toBeNull()
  })
})
```
### 2. Testes de Sistema (E2E)
Utilizamos Cypress para simular a navegação do usuário real.

Instalação do Cypress:
```bash
npm install -D cypress
```
Comando para rodar:
```bash
npx cypress open
```

Cenário de Teste Sugerido (Login de Aluno):

Acessa a página de Login.

Digita e-mail de aluno e senha.

Clica em "Entrar".

Verifica se foi redirecionado para /StudentVew.

Verifica se a lista de treinos foi carregada corretamente.

---

## 📂 Estrutura do Projeto
- src/components: Componentes reutilizáveis (Modais, Listas, Cards).

- src/layouts: Estruturas de página (Barra lateral, Topo).

- src/pages: Páginas da aplicação (Roteamento automático).

  - index.vue: Dashboard do Personal (Gestão).

  - StudentView.vue: Área do Aluno (Visualização).

  - LoginPage.vue: Tela de Login.

- src/stores: Gerenciamento de estado global (Auth, Tasks, Students).

- src/lib: Configuração do cliente Supabase.

---

