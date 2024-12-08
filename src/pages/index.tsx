import { Button, Card, Typography, List, Space } from "antd/lib";
import Link from "next/link";
import { useState } from "react";

const { Title, Text } = Typography;

export default function HomePage({ companies: initialCompanies }) {
  const [companies, setCompanies] = useState(initialCompanies);

  const handleRemoveCompany = async (companyId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/companies/${companyId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCompanies(companies.filter((company) => company.id !== companyId));
      } else {
        console.error("Erro ao excluir a empresa:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Title level={2}>Empresas</Title>
      <Link href="/company/register">
        <Button type="primary" style={{ marginBottom: "20px" }}>
          Criar uma nova empresa
        </Button>
      </Link>

      <List
        dataSource={companies}
        locale={{ emptyText: "Nenhuma empresa cadastrada." }}
        renderItem={(company: Company) => (
          <List.Item style={{ padding: 0 }}>
            <Card
              title={company.description}
              style={{ width: "100%" }}
              extra={
                <Button
                  danger
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCompany(company.id);
                  }}
                >
                  Remover
                </Button>
              }
            >
              <Link
                href={`/company/${company.id}`}
                style={{ display: "block", width: "100%" }}
              >
                <Space direction="vertical">
                  <Text>
                    <strong>CNPJ:</strong> {company.cnpj}
                  </Text>
                  <Text>
                    <strong>Contato:</strong> {company.contactName}
                  </Text>
                </Space>
              </Link>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const response = await fetch("http://localhost:3001/companies");
    const companies = await response.json();

    return {
      props: {
        companies,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    return {
      props: {
        companies: [],
      },
    };
  }
}
