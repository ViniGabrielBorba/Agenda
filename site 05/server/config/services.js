// Configuração de serviços para Salão de Beleza
// Manicure, Pedicure, Alongamentos, Cabelo e Estética

const SERVICES_CONFIG = {
  categories: [
    {
      id: 'manicure',
      name: '💅 Manicure',
      icon: '💅',
      services: [
        {
          name: 'Manicure (cutícula + esmaltação)',
          duration: 45,
          price: 35.00,
          description: 'Manicure completa com cutícula e esmaltação tradicional'
        },
        {
          name: 'Esmaltação simples',
          duration: 20,
          price: 15.00,
          description: 'Aplicação de esmalte tradicional'
        },
        {
          name: 'Esmaltação em gel',
          duration: 30,
          price: 25.00,
          description: 'Esmaltação com gel, maior durabilidade'
        },
        {
          name: 'Francesinha',
          duration: 40,
          price: 30.00,
          description: 'Manicure francesinha clássica'
        },
        {
          name: 'Blindagem',
          duration: 50,
          price: 45.00,
          description: 'Blindagem de unhas para fortalecimento'
        },
        {
          name: 'Banho de gel',
          duration: 35,
          price: 28.00,
          description: 'Banho de gel para unhas'
        },
        {
          name: 'Spa das mãos',
          duration: 60,
          price: 55.00,
          description: 'Tratamento completo spa para as mãos'
        },
        {
          name: 'Reparo de unha',
          duration: 15,
          price: 10.00,
          description: 'Reparo de unha quebrada ou lascada'
        }
      ]
    },
    {
      id: 'pedicure',
      name: '🦶 Pedicure',
      icon: '🦶',
      services: [
        {
          name: 'Pedicure (cutícula + esmaltação)',
          duration: 60,
          price: 40.00,
          description: 'Pedicure completa com cutícula e esmaltação'
        },
        {
          name: 'Esmaltação em gel no pé',
          duration: 35,
          price: 30.00,
          description: 'Esmaltação com gel nos pés'
        },
        {
          name: 'Spa dos pés',
          duration: 75,
          price: 65.00,
          description: 'Tratamento completo spa para os pés'
        },
        {
          name: 'Reparo de unha do pé',
          duration: 20,
          price: 12.00,
          description: 'Reparo de unha do pé quebrada'
        }
      ]
    },
    {
      id: 'alongamentos',
      name: '✨ Alongamentos',
      icon: '✨',
      services: [
        {
          name: 'Alongamento em fibra de vidro',
          duration: 120,
          price: 120.00,
          description: 'Alongamento de unhas com fibra de vidro'
        },
        {
          name: 'Alongamento em gel',
          duration: 120,
          price: 130.00,
          description: 'Alongamento de unhas com gel'
        },
        {
          name: 'Alongamento polygel',
          duration: 120,
          price: 140.00,
          description: 'Alongamento com polygel, mais resistente'
        },
        {
          name: 'Manutenção de alongamento',
          duration: 90,
          price: 80.00,
          description: 'Manutenção de unhas alongadas'
        },
        {
          name: 'Remoção de alongamento',
          duration: 45,
          price: 35.00,
          description: 'Remoção segura de unhas alongadas'
        },
        {
          name: 'Reparo de alongamento',
          duration: 30,
          price: 25.00,
          description: 'Reparo de unha alongada quebrada'
        }
      ]
    },
    {
      id: 'cabelo',
      name: '💇‍♀️ Cabelo',
      icon: '💇‍♀️',
      services: [
        {
          name: 'Corte feminino',
          duration: 45,
          price: 50.00,
          description: 'Corte de cabelo feminino'
        },
        {
          name: 'Corte masculino',
          duration: 30,
          price: 35.00,
          description: 'Corte de cabelo masculino'
        },
        {
          name: 'Corte infantil',
          duration: 30,
          price: 30.00,
          description: 'Corte de cabelo infantil'
        },
        {
          name: 'Escova',
          duration: 40,
          price: 45.00,
          description: 'Escova para alisar e modelar'
        },
        {
          name: 'Babyliss / Modelagem',
          duration: 50,
          price: 55.00,
          description: 'Modelagem com babyliss'
        },
        {
          name: 'Progressiva',
          duration: 180,
          price: 200.00,
          description: 'Tratamento progressiva capilar'
        },
        {
          name: 'Botox',
          duration: 90,
          price: 150.00,
          description: 'Tratamento botox capilar'
        },
        {
          name: 'Hidratação',
          duration: 60,
          price: 60.00,
          description: 'Hidratação profunda'
        },
        {
          name: 'Nutrição',
          duration: 60,
          price: 65.00,
          description: 'Nutrição capilar'
        },
        {
          name: 'Reconstrução',
          duration: 60,
          price: 70.00,
          description: 'Reconstrução capilar'
        },
        {
          name: 'Cronograma capilar',
          duration: 90,
          price: 85.00,
          description: 'Tratamento completo cronograma capilar'
        },
        {
          name: 'Coloração',
          duration: 120,
          price: 120.00,
          description: 'Coloração completa'
        },
        {
          name: 'Tonalização',
          duration: 60,
          price: 80.00,
          description: 'Tonalização de cabelo'
        },
        {
          name: 'Luzes / Mechas',
          duration: 150,
          price: 180.00,
          description: 'Aplicação de luzes ou mechas'
        },
        {
          name: 'Matização',
          duration: 45,
          price: 50.00,
          description: 'Matização de cabelo'
        }
      ]
    },
    {
      id: 'estetica',
      name: '💆 Estética / Sobrancelha / Cílios',
      icon: '💆',
      services: [
        {
          name: 'Design de sobrancelha',
          duration: 30,
          price: 25.00,
          description: 'Design e modelagem de sobrancelhas'
        },
        {
          name: 'Design + henna',
          duration: 45,
          price: 40.00,
          description: 'Design de sobrancelha com henna'
        },
        {
          name: 'Brow lamination',
          duration: 60,
          price: 80.00,
          description: 'Brow lamination para sobrancelhas'
        },
        {
          name: 'Lash lifting',
          duration: 60,
          price: 90.00,
          description: 'Lash lifting para cílios'
        },
        {
          name: 'Extensão de cílios (fio a fio)',
          duration: 120,
          price: 150.00,
          description: 'Extensão de cílios fio a fio'
        },
        {
          name: 'Extensão de cílios (híbrido)',
          duration: 120,
          price: 160.00,
          description: 'Extensão de cílios híbrido'
        },
        {
          name: 'Extensão de cílios (volume russo)',
          duration: 150,
          price: 180.00,
          description: 'Extensão de cílios volume russo'
        },
        {
          name: 'Manutenção de cílios',
          duration: 60,
          price: 80.00,
          description: 'Manutenção de extensão de cílios'
        },
        {
          name: 'Remoção de cílios',
          duration: 30,
          price: 30.00,
          description: 'Remoção de extensão de cílios'
        }
      ]
    }
  ]
}

module.exports = {
  SERVICES_CONFIG
}

