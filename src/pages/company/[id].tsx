import { useState } from "react";
import { useRouter } from "next/router";
import {
  Typography,
  Input,
  Button,
  List,
  Space,
  message,
  Divider,
} from "antd/lib";

const { Title, Text } = Typography;

export default function CompanyDetails({ company }) {
  const router = useRouter();
  const [description, setDescription] = useState(company?.description || "");
  const [cnpj, setCnpj] = useState(company?.cnpj || "");
  const [contactName, setContactName] = useState(company?.contactName || "");
  const [newGroupName, setNewGroupName] = useState("");
  const [groups, setGroups] = useState(company?.groups || []);
  const [loading, setLoading] = useState(false);

  if (!company) {
    return <Text>Carregando...</Text>;
  }

  const handleUpdateCompany = async () => {
    const updatedCompany = {
      ...company,
      description,
      cnpj,
      contactName,
    };

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/companies/${company.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCompany),
        }
      );

      if (response.ok) {
        message.success("Empresa atualizada com sucesso!");
      } else {
        message.error("Erro ao atualizar a empresa.");
      }
    } catch (error) {
      console.error("Erro ao atualizar a empresa:", error);
      message.error("Erro ao atualizar a empresa.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupName) {
      message.warning("O nome do grupo não pode estar vazio.");
      return;
    }

    const newGroup = { id: Date.now(), name: newGroupName };
    const updatedCompany = {
      ...company,
      groups: [...groups, newGroup],
    };

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/companies/${company.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCompany),
        }
      );

      if (response.ok) {
        setGroups([...groups, newGroup]);
        setNewGroupName("");
        message.success("Grupo adicionado com sucesso!");
      } else {
        message.error("Erro ao adicionar o grupo.");
      }
    } catch (error) {
      console.error("Erro ao adicionar o grupo:", error);
      message.error("Erro ao adicionar o grupo.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGroup = async (groupId) => {
    const updatedGroups = groups.filter((group) => group.id !== groupId);
    const updatedCompany = {
      ...company,
      groups: updatedGroups,
    };

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/companies/${company.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCompany),
        }
      );

      if (response.ok) {
        setGroups(updatedGroups);
        message.success("Grupo removido com sucesso!");
      } else {
        message.error("Erro ao remover o grupo.");
      }
    } catch (error) {
      console.error("Erro ao remover o grupo:", error);
      message.error("Erro ao remover o grupo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Title level={2}>Detalhes da Empresa</Title>

      <div>
        <Text strong>Descrição:</Text>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição da empresa"
        />
      </div>

      <div>
        <Text strong>CNPJ:</Text>
        <Input
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          placeholder="CNPJ da empresa"
        />
      </div>

      <div>
        <Text strong>Nome do Contato:</Text>
        <Input
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          placeholder="Nome do contato"
        />
      </div>

      <Button type="primary" onClick={handleUpdateCompany} loading={loading}>
        Atualizar Empresa
      </Button>

      <Divider />

      <Title level={3}>Grupos</Title>
      <List
        bordered
        dataSource={groups}
        renderItem={(group: Group) => (
          <List.Item
            actions={[
              <Button
                danger
                onClick={() => handleRemoveGroup(group.id)}
                loading={loading}
              >
                Remover
              </Button>,
            ]}
          >
            {group.name}
          </List.Item>
        )}
      />

      <Input
        value={newGroupName}
        onChange={(e) => setNewGroupName(e.target.value)}
        placeholder="Nome do novo grupo"
        style={{ width: "300px" }}
      />
      <Button
        type="dashed"
        onClick={handleAddGroup}
        loading={loading}
        style={{ marginTop: "10px" }}
      >
        Adicionar Grupo
      </Button>
    </Space>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const response = await fetch(`http://localhost:3001/companies/${params.id}`);
    const company = await response.json();

    return {
      props: {
        company,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    return {
      props: {
        company: null,
      },
    };
  }
}